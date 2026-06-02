// api/workspace/attendance.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return res.status(500).json({ error: "Database URL missing." });

  const sql = neon(dbUrl);

  try {
    // Look at this! We unpack the dynamic userId directly from the incoming front-end payload body!
    const { userId, day, timestamp, isLate } = req.body;
    const logDate = new Date(timestamp).toISOString().split("T")[0];

    const result = await sql`
      INSERT INTO daily_attendance_logs (
        user_id, day_name, log_date, arrival_time, is_late, is_on_site, is_log_empty
      ) 
      VALUES (
        ${Number(userId)}, ${day}, ${logDate}, ${timestamp}, ${isLate}, true, true
      )
      ON CONFLICT (user_id, log_date) 
      DO UPDATE SET 
        arrival_time = EXCLUDED.arrival_time,
        is_late = EXCLUDED.is_late,
        updated_at = NOW()
      RETURNING *;
    `;

    return res.status(200).json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("Attendance API Error:", error);
    return res.status(500).json({ error: "Failed to record attendance." });
  }
}
