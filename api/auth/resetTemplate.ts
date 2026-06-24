export const getResetOtpEmail = (otp: string, role: string, email: string) => {
  const department = role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; line-height: 1.6; color: #374151; max-width: 500px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e5e7eb;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://i.postimg.cc/PxNRYJQt/KATDICT-2-scaled.jpg" alt="KATDICT Logo" style="max-width: 100px; border-radius: 12px;">
    </div>

    <h2 style="color: #065f46; text-align: center; font-size: 22px; margin-bottom: 20px;">
      Admin Security Verification
    </h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hello Admin (<strong>${email}</strong>),
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      You are requesting a password reset for the <strong>${department}</strong> department dashboard. To proceed with this secure update, please use the following One-Time Password (OTP):
    </p>

    <div style="background-color: #f0fdfa; border: 2px dashed #059669; padding: 20px; text-align: center; border-radius: 12px; margin-bottom: 25px;">
      <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #065f46;">${otp}</span>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 30px;">
      This code will expire in <strong>5 minutes</strong>. If you did not initiate this request, please ignore this email or contact the ICT directorate immediately.
    </p>
    
    <div style="padding-top: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">This is an automated security notification for KATDICT administrators.</p>
    </div>
  </div>
`;
};
