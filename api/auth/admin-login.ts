import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index.js";
import { admins } from "../../src/db/schema.js";
import { ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Fetch admin from DB
    const [admin] = await db
      .select()
      .from(admins)
      .where(ilike(admins.email, cleanEmail));

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 2. Dual-mode password verification (Migration Strategy)
    let isPasswordValid = false;

    // Check if the stored password looks like a bcrypt hash (starts with $2a$, $2b$, or $2y$)
    const isHashed = admin.password.startsWith("$2");

    if (isHashed) {
      // Use bcrypt to compare the hashed password
      isPasswordValid = await bcrypt.compare(password, admin.password);
    } else {
      // Fallback: Compare plain text (Legacy support)
      isPasswordValid = password === admin.password;
    }

    if (!isPasswordValid) {
      console.warn(`[Login] Failed authentication attempt for: ${cleanEmail}`);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 3. Construct the secure user session
    const sessionUser = {
      id: admin.id,
      email: admin.email,
      role: admin.managedRole,
      managed_role: admin.managedRole,
      isAdmin: true,
    };

    res.setHeader("Cache-Control", "no-store, max-age=0");

    return res.status(200).json({
      success: true,
      message: "Admin authentication successful",
      user: sessionUser,
    });
  } catch (error) {
    console.error("Admin Login Backend Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
