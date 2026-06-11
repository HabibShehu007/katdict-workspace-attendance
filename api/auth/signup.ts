import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { getWelcomeEmail } from "./welcomeTemplate.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({ error: "Database configuration error." });
  }

  const sql = neon(dbUrl);

  try {
    // 1. Destructure 'role' from the request body
    const { fullName, email, password, role } = req.body;

    // 2. Add 'role' to the validation check
    if (!fullName || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "All profile fields and role are required." });
    }

    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}
    `;
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update the INSERT query to include the 'role' column
    const [newUser] = await sql`
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES (${fullName.trim()}, ${email.toLowerCase().trim()}, ${hashedPassword}, ${role})
      RETURNING id, full_name, email, role, created_at;
    `;
    // 5. Trigger Brevo Email (Native Fetch)
    const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "KATDICT Team",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: newUser.email, name: newUser.full_name }],
        subject: "Welcome to KATDICT WORKSPACE! 🚀",
        htmlContent: getWelcomeEmail(newUser.full_name),
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Brevo API Error:", errorData);
    } else {
      console.log(`Welcome email successfully sent to ${newUser.email}`);
    }

    // 6. Return Success
    return res.status(201).json({
      success: true,
      message: "Workspace account registered successfully.",
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Signup/Email Error:", error);
    return res.status(500).json({ error: "Registration failed." });
  }
}
