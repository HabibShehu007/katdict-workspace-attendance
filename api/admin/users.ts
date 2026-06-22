import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index";
import { users } from "../../src/db/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Assume you have some form of Auth check here to ensure the requester is an Admin
  // For this logic, we expect the client to pass the admin's managed role
  const adminManagedRole = req.query.adminRole as string;

  if (!adminManagedRole) {
    return res
      .status(403)
      .json({ error: "Unauthorized: Missing administrative scope" });
  }

  // LIST USERS (Only for the Admin's managed role)
  if (req.method === "GET") {
    try {
      const teamUsers = await db
        .select({
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          role: users.role,
          currentStreak: users.currentStreak, // Added
          highestStreak: users.highestStreak, // Added
          createdAt: users.createdAt, // Added
          bio: users.bio, // Added
          avatarUrl: users.avatarUrl, // Added
        })
        .from(users)
        .where(eq(users.role, adminManagedRole))
        .orderBy(users.fullName);
      return res.status(200).json({ users: teamUsers });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  // DELETE USER
  if (req.method === "POST") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID required" });

    try {
      // Security: Ensure we only delete a user if they belong to the admin's role
      const deleted = await db
        .delete(users)
        .where(and(eq(users.id, id), eq(users.role, adminManagedRole)));

      if (!deleted)
        return res
          .status(404)
          .json({ error: "User not found or unauthorized" });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
