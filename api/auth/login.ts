import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index.js";
import { users } from "../../src/db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Added for token generation
import { UserRole } from "../../src/types/auth.types.js";
import { getUserResetOtpEmail } from "../../src/template/userResetTemplate.js"; // Ensure path is correct

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
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });

  const { action } = req.query;

  // --- PASSWORD RESET ACTIONS ---
  if (action === "initiate" || action === "verify" || action === "confirm") {
    const { email, otp, tempResetToken, newPassword } = req.body;
    const cleanEmail = (email || "").toLowerCase().trim();

    if (action === "initiate") {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, cleanEmail));
      if (!user) return res.status(404).json({ error: "User not found." });
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await db
        .update(users)
        .set({ otp, otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000) })
        .where(eq(users.email, cleanEmail));

      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY!,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "KATDICT Security",
            email: process.env.BREVO_SENDER_EMAIL,
          },
          to: [{ email: cleanEmail }],
          subject: "Password Reset Request",
          htmlContent: getUserResetOtpEmail(otp, "", cleanEmail),
        }),
      });
      return res.status(200).json({ success: true });
    }

    if (action === "verify") {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, cleanEmail));
      if (
        !user ||
        user.otp !== otp ||
        (user.otpExpiresAt && new Date() > new Date(user.otpExpiresAt))
      ) {
        return res.status(400).json({ error: "Invalid or expired OTP." });
      }
      const token = crypto.randomBytes(32).toString("hex");
      await db
        .update(users)
        .set({ tempResetToken: token, otp: null })
        .where(eq(users.email, cleanEmail));
      return res.status(200).json({ success: true, tempResetToken: token });
    }

    if (action === "confirm") {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, cleanEmail));
      if (!user || user.tempResetToken !== tempResetToken)
        return res.status(400).json({ error: "Unauthorized." });
      const passwordHash = await bcrypt.hash(newPassword, 12);
      await db
        .update(users)
        .set({ passwordHash, tempResetToken: null })
        .where(eq(users.email, cleanEmail));
      return res.status(200).json({ success: true });
    }
  }

  // --- ORIGINAL LOGIN LOGIC START ---
  try {
    const { email, password, latitude, longitude } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    const cleanEmail = email.toLowerCase().trim();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail));
    const isPasswordValid = user
      ? await bcrypt.compare(password, user.passwordHash ?? "")
      : false;

    if (!user || !isPasswordValid) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admins must use the Admin portal." });
    }

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
        role: user.role as UserRole,
        bio: user.bio,
        createdAt: user.createdAt,
        currentStreak: user.currentStreak ?? 0,
        highestStreak: user.highestStreak ?? 0,
        avatarUrl: user.avatarUrl,
        isAdmin: false,
      },
    });
  } catch (error) {
    console.error("Login crashed:", error);
    return res.status(500).json({ error: "Internal authentication error." });
  }
}
