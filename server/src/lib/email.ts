import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailAttachment {
  filename: string;
  content: Buffer | string; // Buffer for binary (PDF), base64 string otherwise
}

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'CyberteksIT LMS <noreply@cyberteks-it.com>',
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    ...(attachments?.length ? { attachments } : {}),
  });

  if (error) throw new Error(error.message);
  return data;
}
