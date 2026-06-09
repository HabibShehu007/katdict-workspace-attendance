// api/admin/delete-user.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "User ID is required" });

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ error: "Failed to delete user." });
  }
}
