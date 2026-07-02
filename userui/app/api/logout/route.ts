"use server";

import { revalidatePath } from "next/cache";
import { headers as appHeaders } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { authServer } from "../../../lib/auth-server";

export async function GET() {
  let redirectUrl;
  try {
    const headers = await appHeaders();
    const { success } = await authServer.api.signOut({
      headers,
    });
    if (success) {
      redirectUrl = "/";
    }
  } catch (error) {
    console.error(error);
  }
  if (redirectUrl) {
    revalidatePath(redirectUrl);
    return redirect(redirectUrl, RedirectType.replace);
  }
  return redirect("/error?status=500&message=server%20error");
}
