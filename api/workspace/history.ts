import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Senior Guard Rules: Enforce strict GET protocol for data retrieval
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res
      .status(500)
      .json({ error: "Database connection string missing." });
  }

  const sql = neon(dbUrl);

  try {
    // 2. Unpack parameters from the client request query string
    const { userId, range } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: userId" });
    }

    // 3. Dynamic Date Range Engine (Calculated based on Server's current UTC/Local clock)
    const now = new Date();

    // Set up default parameters for boundaries
    let startDate: string;
    let endDate: string = now.toISOString().split("T")[0]; // Today is always our upper ceiling

    switch (range) {
      case "today":
        startDate = endDate;
        break;

      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        startDate = yesterdayStr;
        endDate = yesterdayStr; // Ceiling is restricted to just yesterday's calendar date
        break;
      }

      case "7days": {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        startDate = lastWeek.toISOString().split("T")[0];
        break;
      }

      case "14days": {
        const lastTwoWeeks = new Date();
        lastTwoWeeks.setDate(now.getDate() - 14);
        startDate = lastTwoWeeks.toISOString().split("T")[0];
        break;
      }

      default:
        // Default senior fallback: If no range filter parameter is passed, send ALL log history
        startDate = "1970-01-01";
        break;
    }

    // 4. Execute Relational SQL Query utilizing Date Bounds
    // Using ORDER BY log_date DESC to keep chronological flow (newest inputs on top)
    const historyLogs = await sql`
      SELECT 
        id,
        user_id,
        day_name,
        TO_CHAR(log_date, 'YYYY-MM-DD') as formatted_date,
        arrival_time,
        is_late,
        is_on_site,
        project_title,
        project_description,
        tech_stacks,
        ui_reference_url,
        is_log_empty
      FROM daily_attendance_logs
      WHERE user_id = ${Number(userId)}
        AND log_date >= ${startDate}::date
        AND log_date <= ${endDate}::date
      ORDER BY log_date DESC;
    `;

    // 5. Send unified collections response back to client hook
    return res.status(200).json({
      success: true,
      count: historyLogs.length,
      rangeFilterUsed: range || "all",
      data: historyLogs,
    });
  } catch (error: any) {
    console.error("Workspace History API Engine Crash Error:", error);
    return res.status(500).json({
      error:
        "Internal server error while compiling workspace logging history feeds.",
    });
  }
}
