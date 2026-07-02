import { betterAuth } from "better-auth";
import { Pool } from "pg";
import environment from "../../shared/src/environment.ts";
import { nextCookies } from "better-auth/next-js";

const { DOMAIN, DB_URL } = environment();
const database = new Pool({
  connectionString: DB_URL,
});
const authServer = betterAuth({
  appName: "Wildman Stack Auth",
  plugins: [nextCookies()],
  database,
  trustedOrigins: [`https://${DOMAIN}`],
  baseURL: `https://${DOMAIN}/api/auth`,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    requireEmailVerification: false,
  },
  telemetry: {
    enabled: false,
  },
  advanced: {
    useSecureCookies: true,
  },
});

export { authServer };
export default authServer;
