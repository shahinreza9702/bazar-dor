import { betterAuth } from "better-auth";
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { memoryAdapter } from "better-auth/adapters/memory";

const isDev = process.env.NODE_ENV === "development";

console.log("[Auth Config] NODE_ENV:", process.env.NODE_ENV);
console.log("[Auth Config] MONGODB_URL present:", !!process.env.MONGODB_URL);
console.log("[Auth Config] BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
console.log("[Auth Config] GOOGLE_CLIENT_ID present:", !!process.env.GOOGLE_CLIENT_ID);
console.log("[Auth Config] GITHUB_CLIENT_ID present:", !!process.env.GITHUB_CLIENT_ID);

let db: Db | undefined;
let client: MongoClient | undefined;
let usingMemoryAdapter = false;

if (process.env.MONGODB_URL) {
  console.log("[Auth Config] Initializing MongoDB client...");
  client = new MongoClient(process.env.MONGODB_URL as string, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
  });
  try {
    // Probe the connection eagerly so a bad Atlas URL fails fast at boot
    // instead of on every signup/sign-in request.
    await client.connect();
    db = client.db("bazar-dor");
    console.log("[Auth Config] MongoDB client initialized, db:", db.databaseName);
  } catch (err) {
    console.error("[Auth Config] MongoDB connection failed, falling back to memory adapter:", err);
    usingMemoryAdapter = true;
    try {
      await client.close();
    } catch {}
    client = undefined;
    db = undefined;
  }
} else {
  console.warn("[Auth Config] MONGODB_URL not set - using memory adapter");
  usingMemoryAdapter = true;
}

const memoryDB = {
  user: [],
  session: [],
  account: [],
  verification: [],
};

const baseURL = isDev
  ? "http://localhost:3000"
  : process.env.BETTER_AUTH_URL;

const getTrustedOrigins = () => {
  const origins = ["http://localhost:3000", "http://127.0.0.1:3000"];
  if (process.env.BETTER_AUTH_URL) {
    origins.push(process.env.BETTER_AUTH_URL);
  }
  if (!isDev) {
    origins.push("https://*.vercel.app");
  }
  console.log("[Auth Config] Trusted origins:", origins);
  return origins;
};

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  database: db
    ? mongodbAdapter(db, { client: client! })
    : memoryAdapter(memoryDB),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: getTrustedOrigins(),
  onAPIError: {
    onError(error, ctx) {
      // Surface the underlying cause so the client gets a real message
      // instead of an empty `{}` body on a 500.
      console.error("[Auth] API error:", error, "cause:", (error as any)?.cause);
    },
  },
});

console.log("[Auth Config] BetterAuth initialized with baseURL:", baseURL, "| memoryAdapter:", usingMemoryAdapter);