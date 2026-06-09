// api/admin/get-users.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Fetching all necessary profile data, excluding password_hash
    const users = await sql`
      SELECT 
        id, full_name, email, created_at, 
        current_streak, highest_streak, last_activity_date, bio 
      FROM users 
      WHERE role != 'admin' 
      ORDER BY full_name ASC
    `;

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return res.status(500).json({ error: "Failed to fetch users." });
  }
}
