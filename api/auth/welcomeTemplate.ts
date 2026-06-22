export const getWelcomeEmail = (fullName: string, role: string) => {
  // Simple icon components for the email
  const icons = {
    mentorship: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    tasks: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    growth: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
  };

  let roleText =
    "As a designer, your focus here is on creating beautiful, intuitive experiences that solve real problems.";

  if (role === "web_development") {
    roleText =
      "As a developer, your journey here is about mastering the craft of building digital solutions.";
  } else if (role === "networking") {
    roleText =
      "As a network specialist, your focus here is on configuring, securing, and maintaining robust infrastructures.";
  } else if (role === "data_science") {
    roleText =
      "As a data scientist, your journey here is about uncovering insights, building predictive models, and making data-driven decisions.";
  }

  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e5e7eb;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://i.postimg.cc/PxNRYJQt/KATDICT-2-scaled.jpg" alt="KATDICT Logo" style="max-width: 120px; border-radius: 12px;">
    </div>

    <h2 style="color: #065f46; text-align: center; font-size: 24px; font-weight: 800; margin-bottom: 25px;">
      Welcome to KATDICT, ${fullName}!
    </h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      We're happy to have you with us. You've taken a great step toward growing your career. KATDICT is more than a workspace; it’s a place to turn your skills into real expertise.
    </p>

    <p style="font-size: 16px; font-weight: 600; color: #065f46; margin-bottom: 15px;">How we'll help you succeed:</p>
    
    <div style="background-color: #f0fdfa; padding: 25px; border-radius: 16px; margin-bottom: 25px;">
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 20px; display: flex; align-items: flex-start;">
          <div style="margin-right: 12px; margin-top: 2px;">${icons.mentorship}</div>
          <div><strong>Supportive Mentors:</strong> Our mentors are here to help you get unstuck and guide you through your daily work.</div>
        </li>
        <li style="margin-bottom: 20px; display: flex; align-items: flex-start;">
          <div style="margin-right: 12px; margin-top: 2px;">${icons.tasks}</div>
          <div><strong>Daily Progress:</strong> We believe in showing up. Log your tasks regularly so we can see how you're doing and support you better.</div>
        </li>
        <li style="display: flex; align-items: flex-start;">
          <div style="margin-right: 12px; margin-top: 2px;">${icons.growth}</div>
          <div><strong>Focused Growth:</strong> ${roleText}</div>
        </li>
      </ul>
    </div>

    <p style="font-size: 16px; margin-bottom: 30px;">
      We're here to back you every step of the way. When you're ready, log in to your dashboard, pick up your first task, and let's get started.
    </p>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="https://katdict-workspace.vercel.app/login" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
    </div>

    <div style="padding-top: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
      <p style="font-size: 14px; color: #6b7280; margin: 0;">Keep pushing,</p>
      <p style="font-size: 14px; font-weight: 700; color: #111827; margin: 5px 0 0 0;">The KATDICT Mentorship Team</p>
    </div>
  </div>
`;
};
