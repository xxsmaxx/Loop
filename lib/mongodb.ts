import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DB_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI missing. Add MONGODB_URI in Vercel Environment Variables.");
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
    }

    cached.conn = await cached.promise;
    console.log("MongoDB Connected");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.log("MongoDB Connection Error", error);
    throw error;
  }
}
