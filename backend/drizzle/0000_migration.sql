CREATE SCHEMA "wildmanstack";
--> statement-breakpoint
CREATE TABLE "wildmanstack"."blog" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wildmanstack"."blog_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"content" text,
	CONSTRAINT "blog_slug_unique" UNIQUE("slug")
);
