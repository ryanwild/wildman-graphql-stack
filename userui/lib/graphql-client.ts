import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { fetchToken } from "./token";

const authLink = new SetContextLink(async ({ headers }) => {
  const token = await fetchToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = new HttpLink({
  uri: "/graphql",
  credentials: "same-origin",
});

const graphQLClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export { graphQLClient };
