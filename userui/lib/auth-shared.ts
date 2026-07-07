import type { BetterAuthOptions } from "better-auth";

const config = {
  appName: "Wildman Stack",
  telemetry: {
    enabled: false,
  },
} satisfies BetterAuthOptions;

export { config };
