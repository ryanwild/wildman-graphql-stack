import { Client, cacheExchange, fetchExchange } from "urql";
import { authExchange, AuthUtilities } from "@urql/exchange-auth";
import { authClient } from "./auth-client";

const auth = authExchange(async (utils: AuthUtilities) => {
  let token = sessionStorage.getItem("token");
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
    async refreshAuth() {
      const accessToken = await authClient.token();
      if (!accessToken.data || accessToken.error) {
        sessionStorage.clear();
        await authClient.signOut();
        return;
      }
      token = accessToken.data.token;
      /*
      if we have a session,
        then fetch a token
        
        if there was no errors
        update the token variable and return


      Otherwise clear storage and logout
      */
    },
  };
});

const client = new Client({
  url: "/graphql",
  exchanges: [cacheExchange, auth, fetchExchange],
  // fetchOptions: () => {
  //   const token = sessionStorage.getItem("token");
  //   if (token) {
  //     return {
  //       headers: { authorization: `Bearer ${token}` },
  //     };
  //   }
  //   return {};
  // },
});

export { client };
export default client;
