import { createAuthClient } from "better-auth/react";
import { config } from "./auth-shared";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  ...config,
  sessionOptions: {
    refetchInterval: 60,
    refetchOnWindowFocus: true,
    refetchWhenOffline: false,
  },
  plugins: [jwtClient()],
});

export const { useSession } = authClient;
