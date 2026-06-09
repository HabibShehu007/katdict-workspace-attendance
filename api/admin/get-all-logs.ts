// api/admin/get-all-logs.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { filter, startDate, endDate } = req.query;
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) return res.status(500).json({ error: "Database config error." });

  const sql = neon(dbUrl);

  try {
    let whereClause = "";

    // Replace the existing filter/day logic with this:
    if (filter === "custom" && startDate && endDate) {
      whereClause = `WHERE l.log_date BETWEEN '${startDate as string}' AND '${endDate as string}'`;
    } else if (filter === "mon-fri") {
      // Returns all logs from the current week (Monday to Friday)
      whereClause = `WHERE l.log_date >= date_trunc('week', CURRENT_DATE) AND l.log_date <= date_trunc('week', CURRENT_DATE) + INTERVAL '4 days'`;
    } else if (["mon", "tue", "wed", "thu", "fri"].includes(filter as string)) {
      const dayOffset = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4 }[
        filter as string
      ];
      whereClause = `WHERE l.log_date = date_trunc('week', CURRENT_DATE) + INTERVAL '${dayOffset} days'`;
    } else if (filter === "this_week") {
      whereClause = "WHERE l.log_date >= date_trunc('week', CURRENT_DATE)";
    } else if (filter === "all_time") {
      whereClause = "";
    }

    const logs = await sql`
      SELECT 
        l.*, 
        u.full_name as user_name 
      FROM daily_attendance_logs l
      JOIN users u ON l.user_id = u.id
      ${sql.unsafe(whereClause)}
      ORDER BY l.log_date DESC, l.arrival_time DESC
    `;

    return res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error("Admin History Fetch Error:", error);
    return res.status(500).json({ error: "Failed to fetch logs." });
  }
}
