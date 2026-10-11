import { betterAuth } from "better-auth";
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const isDev = process.env.NODE_ENV === "development";

let db: Db | undefined;
let client: MongoClient | undefined;

if (process.env.MONGODB_URL) {
  client = new MongoClient(process.env.MONGODB_URL as string);
  db = client.db("bazar-dor");
}

const baseURL = process.env.BETTER_AUTH_URL || (isDev ? "http://localhost:3000" : undefined);

const getTrustedOrigins = () => {
  const origins = ["http://localhost:3000", "http://127.0.0.1:3000"];
  if (process.env.BETTER_AUTH_URL) {
    origins.push(process.env.BETTER_AUTH_URL);
  }
  // Allow all vercel.app subdomains for preview deployments
  if (!isDev) {
    origins.push("https://*.vercel.app");
  }
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
    : undefined,
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: getTrustedOrigins(),
});