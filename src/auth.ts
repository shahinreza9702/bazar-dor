import { betterAuth } from "better-auth";
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const isDev = process.env.NODE_ENV === "development";

let db: Db | undefined;
let client: MongoClient | undefined;

if (!isDev && process.env.MONGODB_URL) {
  client = new MongoClient(process.env.MONGODB_URL as string);
  db = client.db("bazar-dor");
}

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
  baseURL: isDev ? "http://localhost:3000" : process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: isDev
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : undefined,
});