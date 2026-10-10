import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import type { BetterAuthOptions } from "better-auth";
import type { MemoryDB } from "better-auth/adapters/memory";

const globalForAuth = globalThis as unknown as {
  __bazarDorMemoryDb?: MemoryDB;
};

const memoryDb: MemoryDB = globalForAuth.__bazarDorMemoryDb ?? {
  user: [],
  session: [],
  account: [],
  verification: [],
  authenticator: [],
};

globalForAuth.__bazarDorMemoryDb = memoryDb;

const socialProviders: BetterAuthOptions["socialProviders"] = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "bazar-dor-demo-secret-please-change",
  database: memoryAdapter(memoryDb),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
});
