"use client";

import { Client, cacheExchange, fetchExchange } from "urql";
import { authExchange, AuthUtilities } from "@urql/exchange-auth";
import { authClient } from "./auth-client";

const auth = authExchange(async (utils: AuthUtilities) => {
  let token: string;
  return {
    addAuthToOperation(operation) {
      if (!token) return operation;
      return utils.appendHeaders(operation, {
        Authorization: `Bearer ${token}`,
      });
    },
    didAuthError(error) {
      console.log(error);
      return false;
    },
    willAuthError() {
      if (typeof token === "undefined") {
        return true;
      }
      // we should validate the token here
      return false;
    },
    async refreshAuth() {
      const accessToken = await authClient.token();
      console.log("accessToken", accessToken);
      if (!accessToken.data || accessToken.error) {
        // this logic needs to be reviewed
        // await authClient.signOut();
        return;
      }
      token = accessToken.data.token;
    },
  };
});

const graphqlClient = new Client({
  url: "/graphql",
  exchanges: [cacheExchange, auth, fetchExchange],
});

export { Provider as GraphQLProvider } from "urql";
export { graphqlClient };
export default graphqlClient;
