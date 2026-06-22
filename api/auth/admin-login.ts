import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/";
import { admins } from "../../src/db/schema";
import { ilike } from "drizzle-orm";

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

    // 2. Verify password (Plain text check - placeholder for bcrypt)
    if (password !== admin.password) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 3. Construct a secure user session object
    // We explicitly define isAdmin on the server side
    const sessionUser = {
      id: admin.id,
      email: admin.email,
      role: admin.managedRole,
      managed_role: admin.managedRole,
      isAdmin: true, // This is the server-side source of truth
    };

    // Set a cache-control header to prevent sensitive data from being cached
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
