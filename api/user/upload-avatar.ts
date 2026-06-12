import { put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/";
import { users } from "../../src/db/schema";
import { eq } from "drizzle-orm";

// Helper function to read the stream into a buffer
const getRawBody = (req: VercelRequest): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { searchParams } = new URL(req.url!, `https://${req.headers.host}`);
    const userId = searchParams.get("userId");

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 1. Convert the locked request stream into a clean Buffer
    const fileBuffer = await getRawBody(req);
    const filename = `avatar-${userId}-${Date.now()}.jpg`;

    // 2. Upload the buffer to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: "public",
      contentType: req.headers["content-type"] || "image/jpeg",
    });

    // 3. Update User Table using Drizzle ORM
    await db
      .update(users)
      .set({ avatarUrl: blob.url })
      .where(eq(users.id, Number(userId)));

    return res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Failed to upload avatar" });
  }
}
