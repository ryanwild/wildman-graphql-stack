import { useDisableIntrospection } from "@graphql-yoga/plugin-disable-introspection";
import {
  createRemoteJwksSigningKeyProvider,
  extractFromHeader,
  useJWT,
} from "@graphql-yoga/plugin-jwt";
import { createYoga, useReadinessCheck } from "graphql-yoga";
import { createServer, Server } from "node:http";
import { promisify } from "node:util";
import environment from "../../shared/src/environment.ts";
import { databaseAvailable } from "./db/query.ts";
import { schema } from "./schema.ts";

const { BACKEND_DEBUG, DOMAIN } = environment();

let server: Server;

const yogaInit = () =>
  createYoga({
    schema,
    logging: true,
    // cors: { origin: BACKEND_CORS_ORIGINS, credentials: true, methods: ['GET', 'POST'] },
    healthCheckEndpoint: "/health",
    landingPage: false,
    graphqlEndpoint: "/graphql",
    graphiql: BACKEND_DEBUG
      ? {
          defaultQuery: "# HELLO", // File a bug here, the default query is ignored
        }
      : false,
    plugins: [
      BACKEND_DEBUG === false && useDisableIntrospection(),
      useReadinessCheck({
        endpoint: "/ready",
        check: async () => {
          try {
            await databaseAvailable();
            // if true, respond with 200 OK
            return true;
          } catch (err) {
            // log the error on the server for debugging purposes
            console.error(err);
            // if false, respond with 503 Service Unavailable and no body
            return false;
          }
        },
      }),
      useJWT({
        signingKeyProviders: [
          createRemoteJwksSigningKeyProvider({
            jwksUri: `https://${DOMAIN}/api/auth/jwks`,
          }),
        ],
        tokenLookupLocations: [
          extractFromHeader({ name: "Authorization", prefix: "Bearer" }),
        ],
        tokenVerification: {
          issuer: `https://${DOMAIN}`,
          audience: "web",
          algorithms: ["ES512"],
        },
        extendContext: true,
        reject: {
          missingToken: true,
          invalidToken: true,
        },
      }),
    ],
  });

const shutdownServer = async () => {
  if (server) {
    const shutdown = promisify(server.close).bind(server);
    try {
      await shutdown();
      console.log("Server closed gracefully");
      process.exit(0);
    } catch (err) {
      console.error("Error during server shutdown", err);
      process.exit(1);
    }
  } else {
    return;
  }
};

const startServer = async () => {
  const yoga = yogaInit();
  server = createServer(yoga);

  server.once("close", async () => {
    await yoga.dispose();
    console.info("Server is disposed so is Yoga");
  });

  await new Promise<void>((resolve, reject) => {
    server.listen(80, "0.0.0.0", () => {
      resolve();
    });
    server.on("error", (err) => {
      reject(err);
    });
  });
};

export { shutdownServer, startServer };
