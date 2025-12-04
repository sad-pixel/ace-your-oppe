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
