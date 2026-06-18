import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/";
import { admins } from "../../src/db/schema";
import { ilike } from "drizzle-orm"; // Changed from eq

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });

  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    console.log(`[Admin Login Attempt] Email: ${cleanEmail}`);

    // Use ilike for case-insensitive matching
    const [admin] = await db
      .select()
      .from(admins)
      .where(ilike(admins.email, cleanEmail));

    if (!admin) {
      console.log(
        `[Admin Login Failure] No admin found with email: ${cleanEmail}`,
      );
      return res.status(401).json({ error: "Invalid admin credentials." });
    }

    console.log(`[Admin Login Found] Match for email: ${admin.email}`);

    // Plain text check (we will bcrypt this later)
    if (password === admin.password) {
      console.log(
        `[Admin Login Success] Credentials verified for: ${admin.email}`,
      );
      return res.status(200).json({
        success: true,
        user: {
          id: admin.id,
          email: admin.email,
          role: admin.managedRole,
          managed_role: admin.managedRole,
          isAdmin: true,
        },
      });
    }

    console.log(`[Admin Login Failure] Password mismatch for: ${cleanEmail}`);
    return res.status(401).json({ error: "Invalid admin credentials." });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({ error: "Server error." });
  }
}
