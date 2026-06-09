import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const sql = neon(process.env.DATABASE_URL!);

  // Note: For file uploads, you'll need to parse the request.
  // Vercel Blob works best with standard FormData.
  try {
    const { searchParams } = new URL(req.url!, `https://${req.headers.host}`);
    const userId = searchParams.get("userId");
    const filename = `avatar-${userId}-${Date.now()}.jpg`;

    // 1. Upload to Vercel Blob
    const blob = await put(filename, req, {
      access: "public",
    });

    // 2. Update Neon Database
    await sql`
      UPDATE users 
      SET avatar_url = ${blob.url} 
      WHERE id = ${Number(userId)}
    `;

    return res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Failed to upload avatar" });
  }
}
