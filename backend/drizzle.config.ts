import { defineConfig } from "drizzle-kit";
import { environment } from "@wildmanstack/shared";

const { DB_USE_SSL, DB_URL } = environment();

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
    ssl: DB_USE_SSL,
  },
});
