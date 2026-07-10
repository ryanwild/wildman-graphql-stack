import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { jwt, openAPI } from "better-auth/plugins";
import { Pool } from "pg";
import environment from "../../shared/src/environment.ts";
import { config } from "./auth-shared.ts";

const { DOMAIN, DB_URL } = environment();
const database = new Pool({
  connectionString: DB_URL,
});

const serverUrl = `https://${DOMAIN}`;
const plugins = [];
// the order of the plugins array matters
plugins.push(
  jwt({
    disableSettingJwtHeader: true,
    jwt: {
      issuer: serverUrl,
      audience: "web",
      expirationTime: "15m", // access_token expiration
      definePayload: () => {
        return {
          iss: serverUrl,
          aud: "web",
        };
      },
      getSubject: (session) => {
        return session.user.id;
      },
    },
    jwks: {
      disablePrivateKeyEncryption: false,
      keyPairConfig: {
        alg: "ES512",
      },
    },
  }),
);
if (process.env.NODE_ENV === "development") {
  plugins.push(openAPI());
}
plugins.push(nextCookies());

const authServer = betterAuth({
  ...config,
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "Strict",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      version: "1", // Change the version to invalidate all sessions
      enabled: true,
      strategy: "jwe",
      maxAge: 120, // 2 minutes
    },
  },
  account: {
    encryptOAuthTokens: true,
    storeStateStrategy: "database",
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    requireEmailVerification: false,
  },
  plugins,
  database,
  trustedOrigins: [serverUrl],
  baseURL: `${serverUrl}/api/auth`,
});

export { authServer };
export default authServer;
