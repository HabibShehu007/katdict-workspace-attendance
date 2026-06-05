import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return res.status(500).json({ error: "Database URL missing." });

  const sql = neon(dbUrl);

  try {
    const { userId, day, title, desc, stacks, uiUrl, githubUrl, liveUrl } =
      req.body;
    const logDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const uid = Number(userId);

    // 1. Submit/Update the Log
    await sql`
      INSERT INTO daily_attendance_logs (
        user_id, day_name, log_date, project_title, project_description, 
        tech_stacks, ui_reference_url, github_url, live_preview_url, is_log_empty
      ) 
      VALUES (${uid}, ${day}, ${logDate}, ${title}, ${desc}, ${stacks}, 
              ${uiUrl || null}, ${githubUrl || null}, ${liveUrl || null}, false)
      ON CONFLICT (user_id, log_date) 
      DO UPDATE SET 
        project_title = EXCLUDED.project_title,
        project_description = EXCLUDED.project_description,
        tech_stacks = EXCLUDED.tech_stacks,
        ui_reference_url = EXCLUDED.ui_reference_url,
        github_url = EXCLUDED.github_url,
        live_preview_url = EXCLUDED.live_preview_url,
        is_log_empty = false,
        updated_at = NOW();
    `;

    // 2. Update Streak Logic
    // We get the current user stats
    const userStats =
      await sql`SELECT current_streak, last_activity_date FROM users WHERE id = ${uid}`;
    const lastDate = userStats[0]?.last_activity_date;
    const currentStreak = userStats[0]?.current_streak || 0;

    const today = new Date(logDate);
    const last = lastDate ? new Date(lastDate) : null;

    // Calculate difference in days
    const diffTime = last ? today.getTime() - last.getTime() : 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = 1;
    if (diffDays === 1) {
      newStreak = currentStreak + 1; // Consecutive day
    } else if (diffDays === 0) {
      newStreak = currentStreak; // Already submitted today
    } else {
      newStreak = 1; // Streak broken
    }

    // 3. Update User Table
    await sql`
      UPDATE users 
      SET current_streak = ${newStreak},
          highest_streak = GREATEST(highest_streak, ${newStreak}),
          last_activity_date = ${logDate}
      WHERE id = ${uid}
    `;

    return res.status(200).json({ success: true, streak: newStreak });
  } catch (error: any) {
    console.error("Logs API Error:", error);
    return res.status(500).json({ error: "Failed to submit work logs." });
  }
}
