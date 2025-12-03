import { relations } from "drizzle-orm/relations";
import { problemsets, problems, databases } from "./schema";

export const problemsRelations = relations(problems, ({one}) => ({
	problemset: one(problemsets, {
		fields: [problems.setId],
		references: [problemsets.id]
	}),
	database: one(databases, {
		fields: [problems.database],
		references: [databases.id]
	}),
}));

export const problemsetsRelations = relations(problemsets, ({many}) => ({
	problems: many(problems),
}));

export const databasesRelations = relations(databases, ({many}) => ({
	problems: many(problems),
}));