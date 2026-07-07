import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import environment from "../../shared/src/environment.ts";
import { config } from "./auth-shared.ts";

const { DOMAIN, DB_URL } = environment();
const database = new Pool({
  connectionString: DB_URL,
});

const authServer = betterAuth({
  ...config,
  advanced: {
    useSecureCookies: true,
  },
  account: {
    accountLinking: {
      trustedProviders: ["email-password"],
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    requireEmailVerification: false,
  },
  plugins: [jwt(), nextCookies()],
  database,
  trustedOrigins: [`https://${DOMAIN}`],
  baseURL: `https://${DOMAIN}/api/auth`,
});

export { authServer };
export default authServer;
