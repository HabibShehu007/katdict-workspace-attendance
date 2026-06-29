export const getUserResetOtpEmail = (
  otp: string,
  _role: string,
  email: string,
) => {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; line-height: 1.6; color: #374151; max-width: 500px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e5e7eb;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://i.postimg.cc/PxNRYJQt/KATDICT-2-scaled.jpg" alt="KATDICT Logo" style="max-width: 100px; border-radius: 12px;">
    </div>

    <h2 style="color: #065f46; text-align: center; font-size: 22px; margin-bottom: 20px;">
      Account Security Verification
    </h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hello (<strong>${email}</strong>),
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      You are requesting a password reset for your KATDICT account. To proceed with this secure update, please use the following One-Time Password (OTP):
    </p>

    <div style="background-color: #f0fdfa; border: 2px dashed #059669; padding: 20px; text-align: center; border-radius: 12px; margin-bottom: 25px;">
      <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #065f46;">${otp}</span>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 30px;">
      This code will expire in <strong>5 minutes</strong>. If you did not initiate this request, please ignore this email or contact support immediately.
    </p>
    
    <div style="padding-top: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">This is an automated security notification for KATDICT users.</p>
    </div>
  </div>
`;
};
