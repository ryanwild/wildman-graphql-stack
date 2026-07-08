import { createSchema } from "graphql-yoga";
import { typeDefs } from "./schema-types.ts";
import systemInfo from "./resolvers/system-info.ts";

export const schema = createSchema({
  typeDefs,
  resolvers: {
    Query: {
      SystemInfo: systemInfo,
    },
  },
});

export default schema;
