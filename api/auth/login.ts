import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/";
import { users } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Workspace location config
const WORKSPACE_LAT = Number(process.env.VITE_KATDICT_LAT || 12.9876);
const WORKSPACE_LNG = Number(process.env.VITE_KATDICT_LNG || 7.6123);
const ALLOWED_RADIUS_METERS = Number(
  process.env.VITE_MAX_ALLOWED_RADIUS_METERS || 50,
);

function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { email, password, latitude, longitude } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // 1. Fetch user using Drizzle
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()));

    // 2. Validate Password
    const isPasswordValid = user
      ? await bcrypt.compare(password, user.passwordHash ?? "")
      : false;

    if (!user || !isPasswordValid) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }

    // 3. Location Check Logic
    let isWithinWorkspace = false;
    if (latitude !== undefined && longitude !== undefined) {
      const distance = calculateDistanceInMeters(
        Number(latitude),
        Number(longitude),
        WORKSPACE_LAT,
        WORKSPACE_LNG,
      );
      isWithinWorkspace = distance <= ALLOWED_RADIUS_METERS;
    }

    return res.status(200).json({
      success: true,
      message: isWithinWorkspace
        ? "Welcome back!"
        : "Logged in remotely. Features restricted.",
      isWithinWorkspace,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login crashed:", error);
    return res.status(500).json({ error: "Internal authentication error." });
  }
}
