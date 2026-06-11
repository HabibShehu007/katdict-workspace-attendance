// api/admin/get-all-logs.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    const logs = await sql`
      SELECT 
        l.*, 
        u.full_name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM daily_attendance_logs l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.log_date DESC, l.arrival_time DESC
      LIMIT 1000
    `;
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch logs." });
  }
}
