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

function buildDatabase() {
  const mongoUrl = process.env.MONGODB_URL;

  if (mongoUrl) {
    const client = new MongoClient(mongoUrl, {
      // Atlas connection tuning — keep timeouts generous so a cold
      // serverless instance doesn't fail the first request outright.
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
    });

    // Connect eagerly so the first auth request is not delayed by the
    // initial TCP/TLS handshake. Errors are swallowed here — better-auth
    // will surface them when the request actually runs.
    client.connect().catch((error) => {
      console.error("[auth] MongoDB connect failed:", error);
    });

    return mongodbAdapter(client.db("bazar-dor"), {
      usePlural: true,
      transaction: false,
    });
  }

  return memoryAdapter(memoryDb);
}

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET || "bazar-dor-demo-secret-please-change",
  database: buildDatabase(),
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