import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index.js";
import { attendanceLogs, users } from "../../src/db/schema.js";
import { eq, and, sql } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed." });

  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId." });

    const uid = Number(userId);
    const today = new Date().toISOString().split("T")[0];

    // 1. Join attendance with user streaks using Drizzle
    const [result] = await db
      .select({
        log: attendanceLogs,
        currentStreak: users.currentStreak,
        highestStreak: users.highestStreak,
      })
      .from(attendanceLogs)
      .innerJoin(users, eq(users.id, attendanceLogs.userId))
      .where(
        and(eq(attendanceLogs.userId, uid), eq(attendanceLogs.logDate, today)),
      );

    // 2. Fallback: If no log for today, fetch user base stats
    if (!result) {
      const [userStats] = await db
        .select({
          currentStreak: users.currentStreak,
          highestStreak: users.highestStreak,
        })
        .from(users)
        .where(eq(users.id, uid));

      return res.status(200).json({
        success: true,
        data: userStats
          ? { ...userStats, attendance_exists: false, is_log_empty: true }
          : null,
      });
    }

    // 3. Return combined result with attendance flag
    return res.status(200).json({
      success: true,
      data: {
        ...result.log,
        current_streak: result.currentStreak,
        highest_streak: result.highestStreak,
        attendance_exists: true,
      },
    });
  } catch (error) {
    console.error("Database Status Query Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
