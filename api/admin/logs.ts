import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index";
import { users, attendanceLogs } from "../../src/db/schema"; // Use 'attendanceLogs' as named in schema
import { eq, inArray, and, sql } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;
  const targetRoles = ["web_development", "ui_ux_design", "networking"];

  try {
    // 1. GET ALL LOGS
    if (!action || action === "all") {
      const logs = await db
        .select({
          id: attendanceLogs.id,
          projectTitle: attendanceLogs.projectTitle, // Use camelCase from schema
          arrivalTime: attendanceLogs.arrivalTime,
          logDate: attendanceLogs.logDate,
          userName: users.fullName,
          userEmail: users.email,
          userRole: users.role,
        })
        .from(attendanceLogs) // Fixed table name
        .leftJoin(users, eq(attendanceLogs.userId, users.id)) // Fixed column names
        .where(inArray(users.role, targetRoles))
        .orderBy(attendanceLogs.logDate)
        .limit(1000);

      return res.status(200).json(logs);
    }

    // 2. GET DASHBOARD STATS
    if (action === "stats") {
      const totalUsers = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(inArray(users.role, targetRoles));

      const recentLogs = await db
        .select({
          id: attendanceLogs.id,
          projectTitle: attendanceLogs.projectTitle,
          arrivalTime: attendanceLogs.arrivalTime,
          userName: users.fullName,
          userRole: users.role,
        })
        .from(attendanceLogs)
        .leftJoin(users, eq(attendanceLogs.userId, users.id)) // Fixed column names
        .where(
          and(
            eq(attendanceLogs.logDate, sql`CURRENT_DATE`), // Fixed column names
            inArray(users.role, targetRoles),
          ),
        )
        .orderBy(attendanceLogs.arrivalTime)
        .limit(4);

      return res.status(200).json({
        total_users: totalUsers[0].count,
        recentLogs,
      });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }
}
