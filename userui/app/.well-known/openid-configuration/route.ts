import { authServer } from "../../../lib/auth-server.ts";
import { oauthProviderOpenIdConfigMetadata } from "@better-auth/oauth-provider";

export const GET = oauthProviderOpenIdConfigMetadata(authServer);
