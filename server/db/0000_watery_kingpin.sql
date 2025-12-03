-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "problemsets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50),
	"source" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"set_id" integer NOT NULL,
	"question_no" integer NOT NULL,
	"question" text NOT NULL,
	"database" integer,
	"type" varchar(50),
	"golden" text,
	"solution_hash" varchar(255),
	CONSTRAINT "problems_set_id_question_no_key" UNIQUE("set_id","question_no")
);
--> statement-breakpoint
CREATE TABLE "databases" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"schema" text NOT NULL,
	"dump_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."problemsets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_database_fkey" FOREIGN KEY ("database") REFERENCES "public"."databases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_problemsets_name" ON "problemsets" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_problemsets_type" ON "problemsets" USING btree ("type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_problems_database" ON "problems" USING btree ("database" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_problems_set_id" ON "problems" USING btree ("set_id" int4_ops);
*/