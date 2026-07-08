import {
  integer,
  pgSchema,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import environment from "../../../shared/src/environment.ts";

const { DB_NAME } = environment();
export const dbSchema = pgSchema(DB_NAME);

export const blogTable = dbSchema.table("blog", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  content: text(),
});
