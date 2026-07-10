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
  fetchOptions: {
    onSuccess: (ctx) => {
      // any time a "set-auth-token" header is returned
      // from the server we update the session storage
      const jwtToken = ctx.response.headers.get("set-auth-jwt");
      if (jwtToken) {
        sessionStorage.setItem("token", jwtToken);
      }
    },
  },
  plugins: [jwtClient()],
});

export const { useSession } = authClient;
