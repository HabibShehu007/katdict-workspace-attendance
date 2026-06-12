import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/";
import { attendanceLogs } from "../../src/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
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

    const uid = Number(userId);
    const now = new Date();
    let startDate: string;
    let endDate: string;

    // High-Performance Range Calculator Engine
    if (range === "custom" && customStart && customEnd) {
      startDate = customStart as string;
      endDate = customEnd as string;
    } else if (range === "current_week" || !range) {
      const currentDayIndex = now.getDay();
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
        case "7days":
          startDate = new Date(now.setDate(now.getDate() - 7))
            .toISOString()
            .split("T")[0];
          break;
        case "14days":
          startDate = new Date(now.setDate(now.getDate() - 14))
            .toISOString()
            .split("T")[0];
          break;
        default:
          startDate = "1970-01-01";
          break;
      }
    }

    // Execute Drizzle query
    // We select the core fields and the 'workData' dynamic JSONB field
    const historyLogs = await db
      .select()
      .from(attendanceLogs)
      .where(
        and(
          eq(attendanceLogs.userId, uid),
          gte(attendanceLogs.logDate, startDate),
          lte(attendanceLogs.logDate, endDate),
        ),
      )
      .orderBy(desc(attendanceLogs.logDate));

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
