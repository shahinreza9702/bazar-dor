import { createAuthClient } from "better-auth/react";

// The server may use better-auth's dynamic base URL config, which the
// client options type does not accept. The browser client derives its
// base URL from window.location.origin at runtime, so only the typing
// needs the narrower shape.
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});
