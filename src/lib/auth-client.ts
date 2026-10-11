import { createAuthClient } from "better-auth/react";
import type { auth } from "@/auth";

// The server may use better-auth's dynamic base URL config, which the
// client options type does not accept. The browser client derives its
// base URL from window.location.origin at runtime, so only the typing
// needs the narrower shape.
export const authClient = createAuthClient<
  Omit<typeof auth.options, "baseURL"> & { baseURL?: string }
>();

export type Session = typeof auth.$Infer.Session | null;
