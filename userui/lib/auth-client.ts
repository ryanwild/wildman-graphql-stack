import { createAuthClient } from "better-auth/react";
import { config } from "./auth-shared";
import { jwtClient } from "better-auth/client/plugins";
import { setToken } from "./token";
export const authClient = createAuthClient({
  ...config,
  sessionOptions: {
    refetchInterval: 60,
    refetchOnWindowFocus: true,
    refetchWhenOffline: false,
  },
  fetchOptions: {
    onSuccess: (ctx) => {
      const jwtToken = ctx.response.headers.get("set-auth-jwt");
      if (jwtToken) {
        setToken(jwtToken);
      }
    },
  },
  plugins: [jwtClient()],
});

export const { useSession } = authClient;
