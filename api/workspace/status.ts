// api/workspace/status.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Enforce strict GET protocol for status checking
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res
      .status(500)
      .json({
        error: "Database configuration error. Connection string missing.",
      });
  }

  const sql = neon(dbUrl);

  try {
    // 2. Extract the query parameter from the request URL
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Please supply a valid userId query parameter." });
    }

    // 3. Look for a record inside the daily logs matching this userId for TODAY's current calendar date
    const [existingLog] = await sql`
      SELECT * FROM daily_attendance_logs 
      WHERE user_id = ${Number(userId)} 
      AND log_date = CURRENT_DATE
    `;

    // 4. Send back the record. If it doesn't exist, existingLog will be undefined, so we return null.
    return res.status(200).json({
      success: true,
      data: existingLog || null,
    });
  } catch (error: any) {
    console.error("Database Status Query Error:", error);
    return res.status(500).json({
      error:
        "Internal server error while syncing workspace operational states.",
    });
  }
}
