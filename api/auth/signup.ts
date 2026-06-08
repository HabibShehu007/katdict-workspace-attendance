import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import axios from "axios";
import { getWelcomeEmail } from "./welcomeTemplate"; // Importing our clean template

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

  // Initialize Neon SQL driver
  const sql = neon(dbUrl);

  try {
    const { fullName, email, password } = req.body;

    // 3. Defensive input validation
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ error: "All profile fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Security check: Password must be at least 6 characters.",
      });
    }

    // 4. Check if the developer email is already registered
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({
        error:
          "This email address is already registered to an active workspace profile.",
      });
    }

    // 5. Security protocol: Hash the plain text password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Core database transaction
    const [newUser] = await sql`
      INSERT INTO users (full_name, email, password_hash)
      VALUES (${fullName.trim()}, ${email.toLowerCase().trim()}, ${hashedPassword})
      RETURNING id, full_name, email, created_at;
    `;

    // 7. Trigger the Email Engine (Asynchronous)
    const engineUrl = process.env.EMAIL_ENGINE_URL;
    if (engineUrl) {
      axios
        .post(engineUrl, {
          to: newUser.email,
          subject: "Welcome to KATDICT WORKSPACE! 🚀",
          html: getWelcomeEmail(newUser.full_name),
        })
        .catch((err) =>
          console.error("Email Engine Trigger Failed:", err.message),
        );
    }

    // 8. Return structured success payload
    return res.status(201).json({
      success: true,
      message: "Workspace account registered successfully.",
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        createdAt: newUser.created_at,
      },
    });
  } catch (error: any) {
    console.error("Database Transaction Error:", error);
    return res.status(500).json({
      error: "Internal database stream failed. Configuration check required.",
    });
  }
}
