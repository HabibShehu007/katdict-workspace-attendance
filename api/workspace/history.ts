// api/workspace/history.ts (or your data retrieval file)
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
    const {
      userId,
      range,
      startDate: customStart,
      endDate: customEnd,
    } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: userId" });
    }

    const now = new Date();
    let startDate: string;
    let endDate: string;

    // 3. High-Performance Range Calculator Engine
    if (range === "custom" && customStart && customEnd) {
      startDate = customStart as string;
      endDate = customEnd as string;
    } else if (range === "current_week" || !range) {
      const currentDayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

      // Calculate how many days back Monday is
      const daysToMonday = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

      const monday = new Date(now);
      monday.setDate(now.getDate() - daysToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      startDate = monday.toISOString().split("T")[0];
      endDate = sunday.toISOString().split("T")[0];
    } else {
      endDate = now.toISOString().split("T")[0];

      switch (range) {
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
          startDate = "1970-01-01"; // Fallback to grab everything if "all" is explicitly declared
          break;
      }
    }

    // 4. Execute Relational SQL Query utilizing calculated Date Bounds
    // Updated: Added github_url and live_preview_url columns to the SELECT projection
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
        github_url,        -- Fetches your new Git repository link
        live_preview_url,  -- Fetches your new Live deployment link
        is_log_empty
      FROM daily_attendance_logs
      WHERE user_id = ${Number(userId)}
        AND log_date >= ${startDate}::date
        AND log_date <= ${endDate}::date
      ORDER BY log_date DESC;
    `;

    // 5. Send unified collection back to client context
    return res.status(200).json({
      success: true,
      count: historyLogs.length,
      rangeFilterUsed: range || "current_week",
      dateBounds: { startDate, endDate },
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
