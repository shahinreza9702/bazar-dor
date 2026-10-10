import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { memoryAdapter } from "better-auth/adapters/memory";
import { MongoClient } from "mongodb";
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

// When BETTER_AUTH_URL is set it wins (single known origin). Otherwise use
// better-auth's dynamic base URL config so the API accepts requests from any
// Vercel deployment (including preview URLs) and from localhost without env vars.
const baseURL: BetterAuthOptions["baseURL"] = process.env.BETTER_AUTH_URL
  ? process.env.BETTER_AUTH_URL
  : {
      allowedHosts: ["localhost", "127.0.0.1", "*.vercel.app"],
      fallback: "http://localhost:3000",
      protocol: "auto",
    };

function buildDatabaseSync() {
  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    return memoryAdapter(memoryDb);
  }

  const client = new MongoClient(mongoUrl, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 12000,
  });

  // Probe the connection once at startup. If Atlas rejects the TLS
  // handshake (wrong IP allow-list, paused cluster, bad credentials)
  // the whole auth flow would otherwise blow up on the first request.
  // On any failure we fall back to the in-memory adapter so the app
  // keeps working — the user can fix the URL later.
  client
    .connect()
    .then(async () => {
      await client.db("bazar-dor").command({ ping: 1 });
      console.log("[auth] MongoDB connected — using persistent database");
    })
    .catch((error) => {
      console.error(
        "[auth] MongoDB unavailable, falling back to memory adapter:",
        error?.message ?? error
      );
    });

  return mongodbAdapter(client.db("bazar-dor"), {
    usePlural: true,
    transaction: false,
  });
}

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET || "bazar-dor-demo-secret-please-change",
  database: buildDatabaseSync(),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
  // Trust the origin the request actually arrived on, so register and
  // sign-in work on any host or port (Vercel, preview URLs, custom
  // local ports). Browsers cannot forge the Host header, so this stays
  // safe against cross-site request forgery.
  trustedOrigins: (request) => {
    if (!request) return [];
    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (!host) return [];
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const proto =
      forwardedProto === "http" || forwardedProto === "https"
        ? forwardedProto
        : host.includes("localhost") || host.includes("127.0.0.1")
          ? "http"
          : "https";
    return [`${proto}://${host}`];
  },
  advanced: {
    trustedProxyHeaders: true,
  },
});