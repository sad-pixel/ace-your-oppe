import {
  pgTable,
  index,
  serial,
  varchar,
  foreignKey,
  unique,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const problemsets = pgTable(
  "problemsets",
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 50 }),
    source: varchar({ length: 255 }),
  },
  (table) => [
    index("idx_problemsets_name").using(
      "btree",
      table.name.asc().nullsLast().op("text_ops"),
    ),
    index("idx_problemsets_type").using(
      "btree",
      table.type.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const problems = pgTable(
  "problems",
  {
    id: serial().primaryKey().notNull(),
    setId: integer("set_id").notNull(),
    questionNo: integer("question_no").notNull(),
    question: text().notNull(),
    database: integer(),
    type: varchar({ length: 50 }),
    fileName: varchar("file_name", { length: 255 }),
    fileContents: text("file_contents"),
    golden: text(),
    solutionHash: varchar("solution_hash", { length: 255 }),
  },
  (table) => [
    index("idx_problems_database").using(
      "btree",
      table.database.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_problems_set_id").using(
      "btree",
      table.setId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.setId],
      foreignColumns: [problemsets.id],
      name: "problems_set_id_fkey",
    }),
    foreignKey({
      columns: [table.database],
      foreignColumns: [databases.id],
      name: "problems_database_fkey",
    }),
    unique("problems_set_id_question_no_key").on(table.setId, table.questionNo),
  ],
);

export const databases = pgTable("databases", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  schema: text().notNull(),
  dumpUrl: text("dump_url").notNull(),
});
