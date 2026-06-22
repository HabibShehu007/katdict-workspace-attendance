import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index.js";
import { users } from "../../src/db/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { userId, fullName, role, avatarUrl, bio } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId." });

    const uid = Number(userId);

    // Build update object dynamically to only include provided fields
    const updateData: Record<string, any> = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (role !== undefined) updateData.role = role;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (bio !== undefined) updateData.bio = bio;

    // Perform the update
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, uid))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Database Update Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
