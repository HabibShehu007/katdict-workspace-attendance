import { put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index.js";
import { users } from "../../src/db/schema.js";
import { eq } from "drizzle-orm";

// Helper for file uploads
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

  const { action } = req.query; // Usage: /api/profileUpdate?action=update OR ?action=upload&userId=1

  try {
    switch (action) {
      case "update":
        return await handleUpdate(req, res);
      case "upload":
        return await handleUpload(req, res);
      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Profile API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// 1. Logic for updating profile fields
async function handleUpdate(req: VercelRequest, res: VercelResponse) {
  const { userId, fullName, role, avatarUrl, bio } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId." });

  const updateData: Record<string, any> = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (role !== undefined) updateData.role = role;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
  if (bio !== undefined) updateData.bio = bio;

  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, Number(userId)))
    .returning();

  if (!updatedUser) return res.status(404).json({ error: "User not found." });
  return res.status(200).json({ success: true, data: updatedUser });
}

// 2. Logic for uploading avatar
async function handleUpload(req: VercelRequest, res: VercelResponse) {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const fileBuffer = await getRawBody(req);
  const filename = `avatar-${userId}-${Date.now()}.jpg`;

  const blob = await put(filename, fileBuffer, {
    access: "public",
    contentType: req.headers["content-type"] || "image/jpeg",
  });

  await db
    .update(users)
    .set({ avatarUrl: blob.url })
    .where(eq(users.id, Number(userId)));

  return res.status(200).json({ success: true, url: blob.url });
}
