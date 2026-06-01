import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

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
    const { email, password } = req.body;

    // 3. Defensive validation checks
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please supply both email and password credentials." });
    }

    // 4. Query Neon database for the user profile record
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}
    `;

    // 5. Defend against unauthorized access attempts if user is missing
    if (!user) {
      return res
        .status(401)
        .json({
          error: "Invalid credentials. Please verify details and try again.",
        });
    }

    // 6. Security protocol: Compare password against stored hash values
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({
          error: "Invalid credentials. Please verify details and try again.",
        });
    }

    // 7. Success signature response
    return res.status(200).json({
      success: true,
      message: "Authentication successful! Welcome back to workspace.",
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
