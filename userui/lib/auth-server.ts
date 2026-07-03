import { betterAuth } from "better-auth";
import { Pool } from "pg";
import environment from "../../shared/src/environment.ts";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { oauthProvider } from "@better-auth/oauth-provider";

const { DOMAIN, DB_URL } = environment();
const database = new Pool({
  connectionString: DB_URL,
});

const authServer = betterAuth({
  appName: "Wildman Stack Auth",
  plugins: [
    jwt(),
    oauthProvider({
      loginPage: "/login",
      consentPage: "/consent",
    }),
    nextCookies(),
  ],
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
