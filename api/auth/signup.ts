import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index.js";
import { users } from "../../src/db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getWelcomeEmail } from "./welcomeTemplate.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Check for existing user
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, emailLower));

    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insert new user
    const [newUser] = await db
      .insert(users)
      .values({
        fullName: fullName.trim(),
        email: emailLower,
        passwordHash: hashedPassword, // This works ONLY if schema.ts has passwordHash
        role: role,
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
      });

    // 3. Trigger Email with BOTH arguments
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "KATDICT Team", email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: newUser.email, name: newUser.fullName }],
        subject: "Welcome to KATDICT WORKSPACE! 🚀",
        htmlContent: getWelcomeEmail(newUser.fullName, newUser.role), // Pass both here
      }),
    });

    return res.status(201).json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Registration failed." });
  }
}
