import { drizzle } from "drizzle-orm/node-postgres";
import { environment } from "@wildmanstack/shared";
import * as schema from "./schema.ts";

const { DB_URL, BACKEND_DEBUG } = environment();

const database = () =>
  drizzle({ connection: DB_URL, logger: BACKEND_DEBUG, schema });

export { database };
export default database;
