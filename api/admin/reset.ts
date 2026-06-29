import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index.js";
import { admins } from "../../src/db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getResetOtpEmail } from "../../src/template/resetTemplate.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { action } = req.query;

  try {
    switch (action) {
      case "initiate":
        return await handleInitiate(req, res);
      case "verify":
        return await handleVerify(req, res);
      case "confirm":
        return await handleConfirm(req, res);
      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("[API][AdminReset] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleInitiate(req: VercelRequest, res: VercelResponse) {
  const { email } = req.body;
  const [admin] = await db.select().from(admins).where(eq(admins.email, email));

  if (!admin) return res.status(404).json({ error: "Admin not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await db
    .update(admins)
    .set({ otp, otpExpiresAt: expiresAt })
    .where(eq(admins.email, email));

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "KATDICT Admin Security",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: admin.email }],
      subject: "Admin Password Reset",
      htmlContent: getResetOtpEmail(otp, admin.managedRole, admin.email),
    }),
  });

  return res.status(200).json({ success: true });
}

async function handleVerify(req: VercelRequest, res: VercelResponse) {
  const { email, otp } = req.body;
  const [admin] = await db.select().from(admins).where(eq(admins.email, email));

  if (
    !admin ||
    admin.otp !== otp ||
    (admin.otpExpiresAt && new Date() > admin.otpExpiresAt)
  ) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  const tempResetToken = crypto.randomBytes(32).toString("hex");
  await db
    .update(admins)
    .set({ tempResetToken, otp: null })
    .where(eq(admins.email, email));

  return res.status(200).json({ success: true, tempResetToken });
}

async function handleConfirm(req: VercelRequest, res: VercelResponse) {
  const { email, tempResetToken, newEmail, newPassword } = req.body;
  const [admin] = await db.select().from(admins).where(eq(admins.email, email));

  if (!admin || admin.tempResetToken !== tempResetToken) {
    return res.status(400).json({ error: "Unauthorized" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await db
    .update(admins)
    .set({ email: newEmail, password: hashedPassword, tempResetToken: null })
    .where(eq(admins.email, email));

  return res.status(200).json({ success: true });
}
