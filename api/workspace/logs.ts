import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index.js";
import { attendanceLogs, users } from "../../src/db/schema.js";
import { eq, sql } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });

  try {
    // We now accept 'workData' as a single dynamic object
    const { userId, day, title, desc, workData } = req.body;

    const uid = Number(userId);
    const logDate = new Date().toISOString().split("T")[0];

    await db
      .insert(attendanceLogs)
      .values({
        userId: uid,
        dayName: day,
        logDate: logDate,
        projectTitle: title,
        projectDescription: desc,
        isLogEmpty: false,
        workData: workData, // Saving the dynamic object directly
      })
      .onConflictDoUpdate({
        target: [attendanceLogs.userId, attendanceLogs.logDate],
        set: {
          projectTitle: title,
          projectDescription: desc,
          workData: workData, // Updating the dynamic object directly
          isLogEmpty: false,
          updatedAt: new Date(),
        },
      });

    // 2. Streak Logic
    const [user] = await db
      .select({
        currentStreak: users.currentStreak,
        lastActivityDate: users.lastActivityDate,
      })
      .from(users)
      .where(eq(users.id, uid));

    const lastDate = user ? user.lastActivityDate : null;
    const currentStreak = user ? user.currentStreak || 0 : 0;

    const today = new Date(logDate);
    const last = lastDate ? new Date(lastDate) : null;

    let newStreak = 1;

    if (last) {
      const diffTime = today.getTime() - last.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const todayDay = today.getDay();
      const lastDay = last.getDay();

      const isMondayAfterFriday =
        todayDay === 1 && lastDay === 5 && diffDays === 3;

      if (diffDays === 1 || isMondayAfterFriday) {
        newStreak = currentStreak + 1;
      } else if (diffDays === 0) {
        newStreak = currentStreak;
      } else {
        newStreak = 1;
      }
    }

    // 3. Update User Table using Drizzle
    await db
      .update(users)
      .set({
        currentStreak: newStreak,
        highestStreak: sql`GREATEST(highest_streak, ${newStreak})`,
        lastActivityDate: new Date(),
      })
      .where(eq(users.id, uid));

    return res.status(200).json({ success: true, streak: newStreak });
  } catch (error: any) {
    console.error("Logs API Error:", error);
    return res.status(500).json({ error: "Failed to submit work logs." });
  }
}
