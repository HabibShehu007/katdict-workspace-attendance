import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed." });

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return res.status(500).json({ error: "DB config missing." });

  const sql = neon(dbUrl);

  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId." });

    // 1. Join attendance with user streaks
    const [result] = await sql`
      SELECT 
        log.*, 
        u.current_streak, 
        u.highest_streak
      FROM daily_attendance_logs log
      JOIN users u ON u.id = log.user_id
      WHERE log.user_id = ${Number(userId)} 
      AND log.log_date = CURRENT_DATE
    `;

    // 2. Fallback: If no log for today, just get the user's base streak stats
    if (!result) {
      const [userStats] = await sql`
        SELECT current_streak, highest_streak 
        FROM users 
        WHERE id = ${Number(userId)}
      `;
      return res.status(200).json({
        success: true,
        data: userStats
          ? { ...userStats, attendance_exists: false, is_log_empty: true }
          : null,
      });
    }

    // 3. Return result with explicit flag
    return res.status(200).json({
      success: true,
      data: { ...result, attendance_exists: true },
    });
  } catch (error) {
    console.error("Database Status Query Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
