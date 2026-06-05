import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return res.status(500).json({ error: "DB config missing." });

  const sql = neon(dbUrl);

  try {
    const { userId, fullName, role, avatarUrl, bio } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId." });

    // Perform the update
    // Note: We use COALESCE so that if a field is null, it keeps the existing value
    const [updatedUser] = await sql`
      UPDATE users
      SET 
        full_name = COALESCE(${fullName}, full_name),
        role = COALESCE(${role}, role),
        avatar_url = COALESCE(${avatarUrl}, avatar_url),
        bio = COALESCE(${bio}, bio)
      WHERE id = ${Number(userId)}
      RETURNING id, full_name, email, role, avatar_url, bio, current_streak, highest_streak, created_at
    `;

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Database Update Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
