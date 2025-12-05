import { z } from "zod";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { publicProcedure, router } from "./trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { eq, sql } from "drizzle-orm";
import { problemsets, problems, databases } from "./db/schema";
import morgan from "morgan";
const db = drizzle(Bun.env.DATABASE_URL!);

const appRouter = router({
  getAllProblemSets: publicProcedure.query(async () => {
    const problemSets = await db
      .select({
        id: problemsets.id,
        name: problemsets.name,
        type: problemsets.type,
        source: problemsets.source,
        problemCount: sql<number>`count(${problems.id})`,
      })
      .from(problemsets)
      .leftJoin(problems, eq(problems.setId, problemsets.id))
      .groupBy(problemsets.id)
      .orderBy(problemsets.id);

    return problemSets;
  }),
  getAllDatabases: publicProcedure.query(async () => {
    return await db.select().from(databases);
  }),
  getProblemSetById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const id = parseInt(input, 10);

    const problemSet = await db
      .select()
      .from(problemsets)
      .where(eq(problemsets.id, id));

    if (!problemSet.length) {
      return null;
    }

    const problemsList = await db
      .select({
        id: problems.id,
        setId: problems.setId,
        questionNo: problems.questionNo,
        question: problems.question,
        database: problems.database,
        type: problems.type,
        golden: problems.golden,
        solutionHash: problems.solutionHash,
        dataFileName: problems.fileName,
        dataFileContents: problems.fileContents,
        databaseName: databases.name,
      })
      .from(problems)
      .leftJoin(databases, eq(problems.database, databases.id))
      .where(eq(problems.setId, id))
      .orderBy(problems.questionNo);

    return {
      ...problemSet[0],
      problems: problemsList,
    };
  }),
  getProblemSolutionHash: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const { input } = opts;
      const id = parseInt(input, 10);

      const solution = await db
        .select({ solutionHash: problems.solutionHash })
        .from(problems)
        .where(eq(problems.id, id));

      return solution.length ? solution[0].solutionHash : null;
    }),
  getHomeStatistics: publicProcedure.query(async () => {
    // Total number of problem sets
    const totalProblemSets = await db
      .select({ count: sql<number>`count(*)` })
      .from(problemsets);

    // Total number of problems
    const totalProblems = await db
      .select({ count: sql<number>`count(*)` })
      .from(problems);

    // Total number of Python problems
    const totalPythonProblems = await db
      .select({ count: sql<number>`count(*)` })
      .from(problems)
      .where(eq(problems.type, "python"));

    // Total number of SQL problems
    const totalSqlProblems = await db
      .select({ count: sql<number>`count(*)` })
      .from(problems)
      .where(eq(problems.type, "sql"));

    return {
      totalProblemSets: totalProblemSets[0].count,
      totalProblems: totalProblems[0].count,
      totalPythonProblems: totalPythonProblems[0].count,
      totalSqlProblems: totalSqlProblems[0].count,
    };
  }),
  getProblemById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const id = parseInt(input, 10);

    const problem = await db
      .select({
        id: problems.id,
        setId: problems.setId,
        questionNo: problems.questionNo,
        question: problems.question,
        database: problems.database,
        type: problems.type,
        golden: problems.golden,
        solutionHash: problems.solutionHash,
        dataFileName: problems.fileName,
        dataFileContents: problems.fileContents,
        databaseName: databases.name,
      })
      .from(problems)
      .leftJoin(databases, eq(problems.database, databases.id))
      .where(eq(problems.id, id));

    return problem.length ? problem[0] : null;
  }),
  browseProblems: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        type: z.enum(["sql", "python"]).nullable(),
        database: z.enum(["lis", "flis", "university", "eshop"]).nullable(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const { page, limit } = input;
      const offset = (page - 1) * limit;

      // Start with a base query
      let query = db
        .select({
          id: problems.id,
          setId: problems.setId,
          questionNo: problems.questionNo,
          question: problems.question,
          database: problems.database,
          type: problems.type,
          databaseName: databases.name,
          setName: problemsets.name,
        })
        .from(problems)
        .leftJoin(databases, eq(problems.database, databases.id))
        .leftJoin(problemsets, eq(problems.setId, problemsets.id));

      // Add filters based on inputs
      const conditions = [];

      if (input.search) {
        conditions.push(
          sql`${problems.question} ILIKE ${"%" + input.search + "%"}`,
        );
      }

      if (input.type) {
        conditions.push(eq(problems.type, input.type));
      }

      if (input.database) {
        // Filter by database name instead of database ID
        conditions.push(eq(databases.name, input.database));
      }

      // Apply all conditions if there are any
      if (conditions.length > 0) {
        query = query.where(
          conditions.length === 1
            ? conditions[0]
            : sql`${conditions[0]} AND ${sql.join(conditions.slice(1), sql` AND `)}`,
        );
      }

      // Get total count for pagination
      const countQuery = db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(problems)
        .leftJoin(databases, eq(problems.database, databases.id));

      // Apply the same conditions to count query
      if (conditions.length > 0) {
        countQuery.where(
          conditions.length === 1
            ? conditions[0]
            : sql`${conditions[0]} AND ${sql.join(conditions.slice(1), sql` AND `)}`,
        );
      }

      const totalCount = await countQuery;
      const total = totalCount[0]?.count || 0;
      const totalPages = Math.ceil(total / limit);

      // Execute the query with pagination and return results
      const results = await query
        .limit(limit)
        .offset(offset)
        .orderBy(problems.id);

      return {
        data: results,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }),
});

export type AppRouter = typeof appRouter;

const app = express();
// CORS middleware
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS",
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });
app.use(morgan("common"));
app.use(
  (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  },
);
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

// Serve static files from the ./build directory
app.use(express.static("./build"));

// For SPA, send index.html for any routes not matched
app.get("/*splat", (_req: express.Request, res: express.Response) => {
  res.sendFile("index.html", { root: "./build" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  console.log("Current working directory:", process.cwd());
});
