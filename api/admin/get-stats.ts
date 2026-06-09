import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({ error: "Database configuration error." });
  }

  const sql = neon(dbUrl);

  try {
    // 1. Get the aggregate counts
    const [stats] = await sql`
      SELECT 
        (SELECT COUNT(*)::int FROM users) as total_users,
        (SELECT COUNT(DISTINCT user_id)::int FROM daily_attendance_logs WHERE log_date = CURRENT_DATE) as present_users,
        (SELECT COUNT(*)::int FROM daily_attendance_logs WHERE log_date = CURRENT_DATE AND is_log_empty = false) as active_logs
    `;

    // 2. Get the 4 most recent logs with the user's name
    const recentLogs = await sql`
      SELECT 
        l.id, 
        l.project_title, 
        l.arrival_time, 
        u.full_name as user_name
      FROM daily_attendance_logs l
      JOIN users u ON l.user_id = u.id
      WHERE l.log_date = CURRENT_DATE
      ORDER BY l.arrival_time DESC
      LIMIT 4
    `;

    // 3. Return everything combined
    return res.status(200).json({
      success: true,
      totalUsers: stats.total_users,
      presentUsers: stats.present_users,
      activeLogs: stats.active_logs,
      recentLogs: recentLogs, // Array of recent activity
    });
  } catch (error) {
    console.error("Dashboard Data Fetch Error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard data." });
  }
}
