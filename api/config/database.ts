import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI or MONGO_URI is missing: API is running without database access.");
    return;
  }
  await mongoose.connect(env.mongoUri);
}
