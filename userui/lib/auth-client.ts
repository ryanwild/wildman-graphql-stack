import { createAuthClient } from "better-auth/react";
import { config } from "./auth-shared";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  ...config,
  plugins: [jwtClient()],
});

export const { useSession } = authClient;
