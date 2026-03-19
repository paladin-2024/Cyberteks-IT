/**
 * WelcomeStudent email template.
 *
 * Sent when an applicant is ACCEPTED and their student account is created.
 * Returns an HTML string for use with Resend's `html` field.
 */

interface Props {
  fullName: string;
  email: string;
  loginUrl: string;
}

export function welcomeStudentHtml({ fullName, email, loginUrl }: Props): string {
  return `
    <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; color: #1a202c;">
      <div style="background: linear-gradient(135deg, #102a83, #1e40af); color: white; padding: 28px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0 0 6px; font-size: 24px;">Welcome to CyberteksIT LMS!</h1>
        <p style="margin: 0; opacity: 0.85; font-size: 15px;">Your learning journey starts now.</p>
      </div>

      <div style="padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Hi <strong>${fullName}</strong>,</p>

        <p>
          Congratulations! Your application has been <strong style="color: #16a34a;">accepted</strong>.
          Your student account has been created and you now have access to the CyberteksIT Learning Management System.
        </p>

        <div style="background: #f0f4ff; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">Login email:</p>
          <p style="margin: 0; font-weight: bold; color: #102a83;">${email}</p>
        </div>

        <p>Use the temporary password provided by our team, or click below to set a new one:</p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${loginUrl}"
             style="display: inline-block; padding: 13px 32px; background: #102a83; color: white;
                    text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px;">
            Go to LMS Portal
          </a>
        </div>

        <p style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #6b7280;">
          Need help? Contact us at
          <a href="mailto:info@cyberteks-it.com" style="color: #102a83;">info@cyberteks-it.com</a><br/>
          — The CyberteksIT Team
        </p>
      </div>
    </div>
  `;
}
