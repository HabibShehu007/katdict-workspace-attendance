import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  const { action } = req.query;

  try {
    // 1. GET ALL LOGS
    if (!action || action === "all") {
      const logs =
        await sql`SELECT l.*, u.full_name as user_name, u.email as user_email FROM daily_attendance_logs l JOIN users u ON l.user_id = u.id ORDER BY l.log_date DESC LIMIT 1000`;
      return res.status(200).json(logs);
    }

    // 2. GET DASHBOARD STATS
    if (action === "stats") {
      const [stats] =
        await sql`SELECT (SELECT COUNT(*)::int FROM users) as total_users, (SELECT COUNT(DISTINCT user_id)::int FROM daily_attendance_logs WHERE log_date = CURRENT_DATE) as present_users, (SELECT COUNT(*)::int FROM daily_attendance_logs WHERE log_date = CURRENT_DATE AND is_log_empty = false) as active_logs`;
      const recentLogs =
        await sql`SELECT l.id, l.project_title, l.arrival_time, u.full_name as user_name FROM daily_attendance_logs l JOIN users u ON l.user_id = u.id WHERE l.log_date = CURRENT_DATE ORDER BY l.arrival_time DESC LIMIT 4`;
      return res.status(200).json({ ...stats, recentLogs });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    return res.status(500).json({ error: "Database error" });
  }
}
