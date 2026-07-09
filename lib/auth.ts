import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function getCurrentUser(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) return null;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return null;

    const decoded = jwt.verify(token, jwtSecret) as {
      id?: string;
      email?: string;
    };

    await connectDB();

    if (decoded.id) {
      return await User.findById(decoded.id).select("-password");
    }

    if (decoded.email) {
      return await User.findOne({ email: decoded.email }).select("-password");
    }

    return null;
  } catch {
    return null;
  }
}
