"use server";

import { headers } from "next/headers";
import { getSessionCookie } from "better-auth/cookies";

export async function sessionAvailable(): Promise<boolean> {
  const appHeaders = await headers();
  const sessionCookie = getSessionCookie(appHeaders);
  const hasSession = sessionCookie !== null;
  return hasSession;
}
