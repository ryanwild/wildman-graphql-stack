import type { YogaInitialContext } from "graphql-yoga";
import type { CookieStore } from "@whatwg-node/cookie-store";

export const typeDefs = /* GraphQL */ `
  type SystemInfo {
    uptimeInSeconds: Int
    ready: Boolean!
  }
  type Query {
    SystemInfo: SystemInfo!
  }
`;

export default typeDefs;

export interface AppContext extends YogaInitialContext {
  jwt: {
    payload: {
      session: {
        expiresAt: string;
        token: string;
        createdAt: string;
        updatedAt: string;
        ipAddress: string;
        userAgent: string;
        userId: string;
        id: string;
      };
      user: {
        name: string;
        email: string;
        emailVerified: boolean;
        image: null | string;
        createdAt: string;
        updatedAt: string;
        id: string;
      };
      updatedAt: number;
      version: string;
      iat: number;
      exp: number;
    };
    token: {
      value: string;
    };
  };
  cookieStore?: CookieStore;
}
