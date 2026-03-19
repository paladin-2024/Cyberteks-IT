/**
 * PasswordReset email template.
 *
 * Used by app/api/auth/forgot-password/route.ts.
 * Returns an HTML string for use with Resend's `html` field.
 */

interface Props {
  userName: string;
  resetUrl: string;
}

export function passwordResetHtml({ userName, resetUrl }: Props): string {
  return `
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a202c;">
      <div style="background: #102a83; padding: 24px; border-radius: 10px 10px 0 0;">
        <h2 style="color: white; margin: 0;">Password Reset Request</h2>
      </div>
      <div style="padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Hi <strong>${userName}</strong>,</p>
        <p>We received a request to reset the password for your CyberteksIT LMS account.</p>
        <p>Click the button below to reset your password. This link will <strong>expire in 1 hour</strong>.</p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}"
             style="display: inline-block; padding: 13px 32px; background: #E11D48; color: white;
                    text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 13px; color: #6b7280;">
          If you didn&apos;t request a password reset, you can safely ignore this email —
          your password will remain unchanged.
        </p>

        <p style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #6b7280;">
          For security, this link can only be used once.<br/>
          — The CyberteksIT Team
        </p>
      </div>
    </div>
  `;
}
