import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/";
import { attendanceLogs } from "../../src/db/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });

  try {
    const { userId, day, timestamp, isLate } = req.body;
    const uid = Number(userId);
    const logDate = new Date(timestamp).toISOString().split("T")[0];

    // Using Drizzle to perform an Upsert (Insert or Update on conflict)
    // This is clean, readable, and prevents SQL injection by default.
    const [result] = await db
      .insert(attendanceLogs)
      .values({
        userId: uid,
        dayName: day,
        logDate: logDate,
        arrivalTime: new Date(timestamp),
        isLate: isLate,
        isOnSite: true,
        isLogEmpty: true, // Initially empty until they submit their work log
      })
      .onConflictDoUpdate({
        target: [attendanceLogs.userId, attendanceLogs.logDate],
        set: {
          arrivalTime: new Date(timestamp),
          isLate: isLate,
          updatedAt: new Date(),
        },
      })
      .returning(); // Returns the inserted/updated row

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error("Attendance API Error:", error);
    return res.status(500).json({ error: "Failed to record attendance." });
  }
}
