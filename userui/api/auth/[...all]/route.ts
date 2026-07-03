import { authServer } from "../../../lib/auth-server.ts";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(authServer);
