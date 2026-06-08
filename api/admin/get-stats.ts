import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Only allow GET for stats
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({ error: "Database configuration error." });
  }

  const sql = neon(dbUrl);

  try {
    // 2. Query only the count of users
    // We use [result] to destructure the first row from the array
    const [result] = await sql`
      SELECT COUNT(*) as total FROM users
    `;

    // 3. Return the count as an integer
    return res.status(200).json({
      success: true,
      totalUsers: parseInt(result.total, 10),
    });
  } catch (error) {
    console.error("Stats Fetch Error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard stats." });
  }
}
