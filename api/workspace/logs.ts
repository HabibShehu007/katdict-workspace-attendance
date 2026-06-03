// api/workspace/logs.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return res.status(500).json({ error: "Database URL missing." });

  const sql = neon(dbUrl);

  try {
    // 1. Unpacking the new githubUrl and liveUrl from the request body
    const { userId, day, title, desc, stacks, uiUrl, githubUrl, liveUrl } =
      req.body;
    const logDate = new Date().toISOString().split("T")[0];

    const result = await sql`
      INSERT INTO daily_attendance_logs (
        user_id, 
        day_name, 
        log_date, 
        project_title, 
        project_description, 
        tech_stacks, 
        ui_reference_url, 
        github_url, 
        live_preview_url, 
        is_log_empty
      ) 
      VALUES (
        ${Number(userId)}, 
        ${day}, 
        ${logDate}, 
        ${title}, 
        ${desc}, 
        ${stacks}, 
        ${uiUrl || null}, 
        ${githubUrl || null}, 
        ${liveUrl || null}, 
        false
      )
      ON CONFLICT (user_id, log_date) 
      DO UPDATE SET 
        project_title = EXCLUDED.project_title,
        project_description = EXCLUDED.project_description,
        tech_stacks = EXCLUDED.tech_stacks,
        ui_reference_url = EXCLUDED.ui_reference_url,
        github_url = EXCLUDED.github_url,
        live_preview_url = EXCLUDED.live_preview_url,
        is_log_empty = false,
        updated_at = NOW()
      RETURNING *;
    `;

    return res.status(200).json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("Logs API Error:", error);
    return res.status(500).json({ error: "Failed to submit work logs." });
  }
}
