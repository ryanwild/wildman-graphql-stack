import { authServer } from "../../../lib/auth-server";
import { oauthProviderAuthServerMetadata } from "@better-auth/oauth-provider";

export const GET = oauthProviderAuthServerMetadata(authServer);
