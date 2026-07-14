import { authClient } from "./auth-client";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { logout } from "./logout";

// note that sessionStorage throws a SecurityError
// if the user has disabled storage or cookies
// in their browser:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage#securityerror
// in those cases we want to ignore the
// error and save the token in memory
const fetchToken = async (): Promise<string | undefined> => {
  let token: string | undefined;
  try {
    token = sessionStorage.getItem("token") ?? undefined;
  } catch (_ignore) {}
  if (!token) {
    const { data, error } = await authClient.token();
    if (error) {
      logout();
    }
    if (data && !error) {
      token = data?.token;
    }
  }
  return token;
};

const setToken = (token: string) => {
  try {
    sessionStorage.setItem("token", token);
  } catch (_ignore) {}
};

const removeToken = () => {
  try {
    sessionStorage.removeItem("token");
  } catch (_ignore) {}
};

const validateToken = async (token: string | undefined): Promise<boolean> => {
  if (!token) {
    return false;
  }
  try {
    const JWKS = createRemoteJWKSet(
      new URL("https://wildmanstack.localhost/api/auth/jwks"),
    );
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "https://wildmanstack.localhost",
      audience: "web",
    });
    if (payload) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};

export { fetchToken, setToken, removeToken, validateToken };
