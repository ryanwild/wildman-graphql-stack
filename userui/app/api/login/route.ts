"use server";

import type { NextRequest } from "next/server";
import { authServer } from "../../../lib/auth-server";
import { validateLogin } from "../../../lib/validation.ts";
import { isAPIError } from "better-auth/api";
import { headers as appHeaders } from "next/headers";

export type LoginFormState = {
  message?: string;
  data?: {
    email?: string;
    password?: string;
  };
  validation?: {
    email?: string[];
    password?: string[];
  };
};

export async function POST(req: NextRequest) {
  const jsonData = await req.json();
  const data = {
    email: jsonData?.email ?? "",
    password: jsonData?.password ?? "",
  };
  const state: LoginFormState = { data };
  const [valid, validationErrors] = validateLogin(data);
  if (!valid) {
    state.validation = validationErrors as LoginFormState["validation"];
    state.message = "Could not login";
    return Response.json(state, { status: 422 });
  }
  try {
    const { headers } = await authServer.api.signInEmail({
      returnHeaders: true,
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await appHeaders(),
    });

    const responseHeaders = new Headers();
    const responseCookies = headers.getSetCookie();
    responseCookies?.forEach((c) => {
      responseHeaders.set("set-cookie", c);
    });
    return Response.json(state, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    if (isAPIError(error)) {
      state.message = "Error logging in, check your password";
    } else {
      state.message = "Unknown error logging in";
    }
    console.error(error);
    return Response.json(state, { status: 500 });
  }
}
