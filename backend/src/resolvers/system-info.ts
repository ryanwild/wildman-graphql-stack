import { environment } from "@wildmanstack/shared";
import { databaseAvailable } from "../db/query.ts";
import type { AppContext } from "../schema-types.ts";

const { BACKEND_DEBUG } = environment();

export type SystemInfo = {
  uptimeInSeconds: number;
  ready: boolean;
};
const systemInfo = async (
  _parent: unknown,
  _arg: unknown,
  _context: AppContext,
): Promise<SystemInfo> => {
  const uptimeInSeconds = BACKEND_DEBUG ? Math.floor(process.uptime()) : 0;
  const ready = await databaseAvailable();
  return {
    uptimeInSeconds,
    ready,
  };
};

export default systemInfo;
