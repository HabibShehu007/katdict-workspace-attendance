export const getWelcomeEmail = (fullName: string) => `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #1f2937; max-width: 600px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
    
    <!-- Header Image -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://i.postimg.cc/PxNRYJQt/KATDICT-2-scaled.jpg" alt="KATDICT Logo" style="max-width: 140px; height: auto;">
    </div>

    <h2 style="color: #065f46; text-align: center; font-size: 24px; font-weight: 800; margin-bottom: 25px; letter-spacing: -0.5px;">
      Welcome to KATDICT, ${fullName}!
    </h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      It is great to have you on board. You’ve just taken a meaningful step toward your professional growth. KATDICT is more than just a workspace; it is a space designed for you to turn your potential into mastery.
    </p>
    
    <p style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #065f46;">How we grow together:</p>
    
    <div style="background-color: #f0fdfa; padding: 25px; border-radius: 16px; margin-bottom: 25px;">
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 15px; display: flex; align-items: flex-start;">
          <span style="margin-right: 12px; color: #059669; font-weight: bold;">✓</span>
          <div><strong>Active Mentorship:</strong> Your mentors are here to guide you, and they are actively tracking your daily progress to ensure you're on the right path.</div>
        </li>
        <li style="margin-bottom: 15px; display: flex; align-items: flex-start;">
          <span style="margin-right: 12px; color: #059669; font-weight: bold;">✓</span>
          <div><strong>Daily Accountability:</strong> Consistency is the foundation of success. We expect you to log your tasks and stay transparent with your progress.</div>
        </li>
        <li style="display: flex; align-items: flex-start;">
          <span style="margin-right: 12px; color: #059669; font-weight: bold;">✓</span>
          <div><strong>Diligent Commitment:</strong> Your dedication today is the investment that secures your success tomorrow.</div>
        </li>
      </ul>
    </div>

    <p style="font-size: 16px;">
      We are watching, we are supporting, and we are rooting for your breakthrough. Log in to your dashboard, start your first task, and let's get to work!
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
      <p style="font-size: 0.9rem; color: #6b7280; margin: 0;">Keep pushing,</p>
      <p style="font-size: 1rem; font-weight: 700; color: #111827; margin: 5px 0 0 0;">The KATDICT Mentorship Team</p>
    </div>
  </div>
`;
