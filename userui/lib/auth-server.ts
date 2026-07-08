import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import environment from "../../shared/src/environment.ts";
import { config } from "./auth-shared.ts";
import { openAPI } from "better-auth/plugins";

const { DOMAIN, DB_URL } = environment();
const database = new Pool({
  connectionString: DB_URL,
});

const authServer = betterAuth({
  ...config,
  advanced: {
    useSecureCookies: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 120, // 2 minutes
      refreshCache: {
        updateAge: 60, // Refresh when 60 seconds remain before expiry
      },
    },
  },
  account: {
    encryptOAuthTokens: false,
    accountLinking: {
      trustedProviders: ["email-password"],
    },
    storeStateStrategy: "database",
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    requireEmailVerification: false,
  },
  plugins: [
    jwt({
      jwt: {
        issuer: "https://wildmanstack.localhost",
        audience: "web",
        expirationTime: "15m",
      },
      jwks: {
        keyPairConfig: {
          alg: "ES512",
        },
      },
    }),
    openAPI(),
    nextCookies(),
  ],
  database,
  trustedOrigins: [`https://${DOMAIN}`],
  baseURL: `https://${DOMAIN}/api/auth`,
});

export { authServer };
export default authServer;
