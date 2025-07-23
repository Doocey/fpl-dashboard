import { MongoClient, ServerApiVersion } from "mongodb";

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI || !MONGODB_DB) {
  throw new Error("Please define both MONGODB_URI & MONGODB_DB env variables");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = globalThis.mongo;

if (!cached) {
  cached = globalThis.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

    cached.promise = client.connect().then(() => {
      return {
        client,
        db: client.db(MONGODB_DB)
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
