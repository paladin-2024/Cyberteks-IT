/**
 * ApplicationConfirmation email template.
 *
 * Used by app/api/apply/route.ts to send a confirmation to the applicant
 * after they submit their Skills Development Program application.
 *
 * Returns a plain HTML string (not a React component) so it can be
 * passed directly to Resend's `html` field without extra dependencies.
 */

interface Props {
  fullName: string;
  email: string;
  programs: string[];
}

export function applicationConfirmationHtml({ fullName, email, programs }: Props): string {
  const programList = programs.map((p) => `<li>${p}</li>`).join('');

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a202c;">
      <div style="background: #102a83; color: white; padding: 24px; border-radius: 10px 10px 0 0;">
        <img src="https://cyberteks-it.com/logo.png" alt="CyberteksIT" style="height: 36px; margin-bottom: 12px;" />
        <h1 style="margin: 0; font-size: 22px;">Application Received!</h1>
      </div>

      <div style="padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Dear <strong>${fullName}</strong>,</p>

        <p>
          Thank you for applying to the <strong>CyberteksIT Skills Development Program</strong>.
          We have successfully received your application and our admissions team will review it
          within <strong>2–3 business days</strong>.
        </p>

        <div style="background: #f0f4ff; border-left: 4px solid #102a83; padding: 14px 18px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0 0 6px; font-weight: bold; color: #102a83;">Programs applied for:</p>
          <ul style="margin: 0; padding-left: 18px; color: #374151;">${programList}</ul>
        </div>

        <p>We will contact you at <strong>${email}</strong> with the next steps.</p>

        <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #6b7280;">
          Questions? Reply to this email or contact us at
          <a href="mailto:info@cyberteks-it.com" style="color: #102a83;">info@cyberteks-it.com</a>
        </p>

        <p style="margin-top: 8px; font-size: 13px; color: #6b7280;">
          Best regards,<br/><strong>The CyberteksIT Team</strong>
        </p>
      </div>
    </div>
  `;
}
