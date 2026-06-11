import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);

  // LIST USERS
  if (req.method === "GET") {
    const users =
      await sql`SELECT id, full_name, email, role FROM users WHERE role != 'admin' ORDER BY full_name ASC`;
    return res.status(200).json({ users });
  }

  // DELETE USER
  if (req.method === "POST") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID required" });
    await sql`DELETE FROM users WHERE id = ${id}`;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
