"use client";

import { authClient } from "./auth-client";
import { removeToken } from "./token";

const logout = async () => {
  "use client";
  console.log(">>>>>>>>>> logging out");
  removeToken();
  await authClient.signOut();
  window.history.pushState(null, document.title, "/");
  window.location.reload();
};

export { logout };
