import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

// Securely read coordinates from environment configurations with structural fallbacks
const WORKSPACE_LAT = Number(process.env.VITE_KATDICT_LAT || 12.9876);
const WORKSPACE_LNG = Number(process.env.VITE_KATDICT_LNG || 7.6123);
const ALLOWED_RADIUS_METERS = Number(
  process.env.VITE_MAX_ALLOWED_RADIUS_METERS || 50,
);

/**
 * High-performance Haversine mathematical calculation engine
 * Computes the great-circle distance between two coordinates over the Earth's surface.
 */
function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Absolute precision distance in meters
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Enforce strict POST protocol
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // 2. Extract database connection string safely
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({
      error: "Database configuration error. Connection string missing.",
    });
  }

  const sql = neon(dbUrl);

  try {
    // Unpack credentials and incoming device coordinates
    const { email, password, latitude, longitude } = req.body;

    // 3. Defensive validation checks
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please supply both email and password credentials." });
    }

    // 4. Aggressive Geolocation Validation Verification
    let isWithinWorkspace = false;
    let computedDistance = -1;

    console.log(
      "==================== GEOLOCATION ENGINE INBOUND LOG ====================",
    );
    console.log(
      `[Target Anchor Configured]: Lat: ${WORKSPACE_LAT}, Lng: ${WORKSPACE_LNG}, Max Radius: ${ALLOWED_RADIUS_METERS}m`,
    );
    console.log(
      `[Incoming Payload Received]: Email: ${email}, Lat: ${latitude}, Lng: ${longitude}`,
    );

    if (latitude !== undefined && longitude !== undefined) {
      computedDistance = calculateDistanceInMeters(
        Number(latitude),
        Number(longitude),
        WORKSPACE_LAT,
        WORKSPACE_LNG,
      );

      // If the calculated distance falls inside the radius restriction boundary
      if (computedDistance <= ALLOWED_RADIUS_METERS) {
        isWithinWorkspace = true;
      }

      console.log(
        `[Engine Proximity Result]: Calculated Distance is ${computedDistance.toFixed(2)} meters.`,
      );
      console.log(
        `[Security Status Decision]: User Is Within Allowed Perimeter? -> ${isWithinWorkspace ? "YES ✅" : "NO ❌"}`,
      );
    } else {
      console.warn(
        "[Engine Proximity Warning]: Lat/Lng coordinates are completely missing from the request payload body!",
      );
    }
    console.log(
      "========================================================================",
    );

    // 5. Query Neon database for the user profile record
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}
    `;

    // 6. Defend against unauthorized access attempts if user is missing
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials. Please verify details and try again.",
      });
    }

    // 7. Security protocol: Compare password against stored hash values
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json({
        error: "Invalid credentials. Please verify details and try again.",
      });
    }

    // 8. Success signature response including location status flags
    return res.status(200).json({
      success: true,
      message: isWithinWorkspace
        ? "Authentication successful! Welcome back to workspace."
        : "Authenticated remotely. Workspace actions are restricted.",
      isWithinWorkspace, // Pass the verified true/false result back to the frontend
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error: any) {
    console.error("Database Login Error:", error);
    return res.status(500).json({
      error:
        "Internal server authentication failed. Diagnostic check required.",
    });
  }
}
