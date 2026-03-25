/**
 * CyberteksIT — Branded email templates
 * All styles are inline (email clients strip <style> tags).
 * Colors: blue #102a83 · red #E11D48 · dark #0a1a52
 */

const CLIENT_URL = process.env.CLIENT_URL ?? 'https://cyberteks-it.com';

// ─── Shared wrapper ──────────────────────────────────────────────────────────

function layout(headerColor: string, headerLabel: string, title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="background:${headerColor};border-radius:16px 16px 0 0;padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.65);">${headerLabel}</p>
                <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">${title}</h1>
              </td>
              <td align="right" valign="middle" style="padding-left:16px;">
                <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 16px;display:inline-block;">
                  <span style="font-size:18px;font-weight:900;color:#fff;letter-spacing:-0.5px;">Cyber<span style="color:#f87171;">teks</span>IT</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="background:#ffffff;padding:36px 40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          ${body}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0;font-size:13px;color:#64748b;">
                  © ${new Date().getFullYear()} CyberteksIT · Plot 722 Namuli Rd, Bukoto, Kampala — Uganda
                </p>
                <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">
                  <a href="${CLIENT_URL}" style="color:#102a83;text-decoration:none;">cyberteks-it.com</a>
                  &nbsp;·&nbsp;
                  <a href="mailto:info@cyberteks-it.com" style="color:#102a83;text-decoration:none;">info@cyberteks-it.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Reusable bits ───────────────────────────────────────────────────────────

function btn(href: string, label: string, color = '#102a83'): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:10px;margin-top:8px;">${label}</a>`;
}

function pill(text: string, bg = '#e0e7ff', color = '#3730a3'): string {
  return `<span style="display:inline-block;background:${bg};color:${color};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:20px;">${text}</span>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;font-weight:600;width:38%;vertical-align:top;">${label}</td>
    <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#1e293b;vertical-align:top;">${value}</td>
  </tr>`;
}

function section(title: string, content: string): string {
  return `<div style="margin-bottom:28px;">
    <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#102a83;">${title}</p>
    ${content}
  </div>`;
}

// ─── Exported templates ──────────────────────────────────────────────────────

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c] ?? c));

const educationLabels: Record<string, string> = {
  high_school: 'High School / O-Level', diploma_certificate: 'Diploma / Certificate',
  undergraduate: 'Undergraduate Degree', graduate: "Master's / PhD", other: 'Other',
};
const hoursLabels: Record<string, string> = {
  '2_4': '2–4 hrs / week', '5_10': '5–10 hrs / week', '10_plus': '10+ hrs / week',
};

// 1. Admin: new application received
export function adminNewApplicationEmail(data: {
  fullName: string; email: string; phoneNumber: string; cityCountry: string;
  educationLevel: string; programs: string[]; motivation: string;
  careerGoals: string; hoursPerWeek: string;
}): string {
  const programPills = data.programs.map(p => pill(p, '#e0e7ff', '#3730a3')).join(' ');
  const body = `
    <p style="margin:0 0 24px;font-size:15px;color:#475569;">
      A new application has been submitted and is awaiting your review.
    </p>

    ${section('Applicant', `<table width="100%" cellpadding="0" cellspacing="0">
      ${infoRow('Full name', esc(data.fullName))}
      ${infoRow('Email', `<a href="mailto:${esc(data.email)}" style="color:#102a83;">${esc(data.email)}</a>`)}
      ${infoRow('Phone', esc(data.phoneNumber))}
      ${infoRow('Location', esc(data.cityCountry))}
      ${infoRow('Education', esc(educationLabels[data.educationLevel] ?? data.educationLevel))}
      ${infoRow('Availability', esc(hoursLabels[data.hoursPerWeek] ?? data.hoursPerWeek))}
    </table>`)}

    ${section('Programs Selected', `<p style="margin:0;line-height:1.8;">${programPills}</p>`)}

    ${section('Motivation', `<p style="margin:0;font-size:14px;color:#334155;line-height:1.7;background:#f8fafc;border-left:3px solid #102a83;padding:12px 16px;border-radius:0 8px 8px 0;">${esc(data.motivation).replace(/\n/g, '<br>')}</p>`)}

    ${section('Career Goals', `<p style="margin:0;font-size:14px;color:#334155;line-height:1.7;background:#f8fafc;border-left:3px solid #E11D48;padding:12px 16px;border-radius:0 8px 8px 0;">${esc(data.careerGoals).replace(/\n/g, '<br>')}</p>`)}

    <div style="margin-top:28px;">
      ${btn(`${CLIENT_URL}/admin/applications`, '→ Review Application')}
    </div>
  `;
  return layout('linear-gradient(135deg,#102a83,#1e3fa8)', 'New Application', `${esc(data.fullName)} has applied`, body);
}

// 2. Applicant: confirmation of receipt
export function applicantConfirmationEmail(data: {
  fullName: string; email: string; programs: string[];
}): string {
  const programList = data.programs.map(p => `<li style="padding:4px 0;color:#334155;">${esc(p)}</li>`).join('');
  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">Dear <strong style="color:#1e293b;">${esc(data.fullName)}</strong>,</p>

    <div style="background:linear-gradient(135deg,#eff6ff,#eef2ff);border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1e40af;">✅ Application Received</p>
      <p style="margin:0;font-size:14px;color:#3b4fd8;line-height:1.6;">
        Thank you for applying to the <strong>CyberteksIT Skills Development Program</strong>. Our team will review your application within <strong>2–3 business days</strong>.
      </p>
    </div>

    ${section('Programs You Applied For', `<ul style="margin:0;padding-left:20px;">${programList}</ul>`)}

    <p style="font-size:14px;color:#475569;line-height:1.7;">
      We will reach out to <strong>${esc(data.email)}</strong> with the next steps. If you have any questions in the meantime, feel free to contact us at
      <a href="mailto:info@cyberteks-it.com" style="color:#102a83;">info@cyberteks-it.com</a>.
    </p>

    <p style="margin-top:28px;font-size:14px;color:#64748b;">
      Warm regards,<br>
      <strong style="color:#1e293b;">The CyberteksIT Team</strong>
    </p>
  `;
  return layout('#102a83', 'Skills Development Program', 'Application Received!', body);
}

// 3. Applicant: accepted + login credentials
export function applicantAcceptedEmail(data: {
  fullName: string; email: string; tempPassword: string;
  programs: string[]; reviewNotes?: string;
}): string {
  const programList = data.programs.map(p => `<li style="padding:4px 0;color:#334155;">${esc(p)}</li>`).join('');
  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">Dear <strong style="color:#1e293b;">${esc(data.fullName)}</strong>,</p>

    <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:15px;font-weight:800;color:#15803d;">🎉 Congratulations — You've been accepted!</p>
      <p style="margin:0;font-size:14px;color:#166534;line-height:1.6;">
        Your application to the <strong>CyberteksIT Skills Development Program</strong> has been approved. Your student account is ready.
      </p>
    </div>

    ${data.reviewNotes ? section('Note from the Team', `<p style="margin:0;font-size:14px;color:#334155;background:#fffbeb;border-left:3px solid #f59e0b;padding:12px 16px;border-radius:0 8px 8px 0;line-height:1.7;">${esc(data.reviewNotes)}</p>`) : ''}

    ${section('Programs Enrolled', `<ul style="margin:0;padding-left:20px;">${programList}</ul>`)}

    ${section('Your Login Credentials', `
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoRow('Login URL', `<a href="${CLIENT_URL}/login" style="color:#102a83;font-weight:600;">${CLIENT_URL}/login</a>`)}
          ${infoRow('Email', esc(data.email))}
          ${infoRow('Temporary Password', `<code style="background:#e0e7ff;color:#3730a3;padding:3px 10px;border-radius:6px;font-size:13px;font-weight:700;">${esc(data.tempPassword)}</code>`)}
        </table>
      </div>
      <p style="margin:12px 0 0;font-size:12px;color:#ef4444;font-weight:600;">⚠️ Please change your password immediately after your first login.</p>
    `)}

    <div style="margin-top:28px;">
      ${btn(`${CLIENT_URL}/login`, '→ Login to LMS', '#102a83')}
    </div>

    <p style="margin-top:32px;font-size:14px;color:#64748b;">
      Welcome aboard!<br>
      <strong style="color:#1e293b;">The CyberteksIT Team</strong>
    </p>
  `;
  return layout('linear-gradient(135deg,#15803d,#16a34a)', 'Application Accepted', 'Welcome to CyberteksIT LMS!', body);
}

// 4. Applicant: rejected
export function applicantRejectedEmail(data: {
  fullName: string; reviewNotes?: string;
}): string {
  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">Dear <strong style="color:#1e293b;">${esc(data.fullName)}</strong>,</p>

    <p style="font-size:14px;color:#475569;line-height:1.7;">
      Thank you for your interest in the <strong>CyberteksIT Skills Development Program</strong> and for taking the time to apply. After careful review of your application, we are unfortunately unable to offer you a place in this cohort.
    </p>

    ${data.reviewNotes ? `
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#c2410c;">Feedback from the team</p>
      <p style="margin:0;font-size:14px;color:#7c2d12;line-height:1.7;">${esc(data.reviewNotes)}</p>
    </div>` : ''}

    <p style="font-size:14px;color:#475569;line-height:1.7;">
      We open new cohorts regularly — we strongly encourage you to apply again in the future. You can also explore our free resources and upcoming programs at
      <a href="${CLIENT_URL}/services/ict-skilling" style="color:#102a83;">${CLIENT_URL}/services/ict-skilling</a>.
    </p>

    <div style="margin-top:28px;">
      ${btn(`${CLIENT_URL}/apply`, '→ Apply for Next Cohort', '#E11D48')}
    </div>

    <p style="margin-top:32px;font-size:14px;color:#64748b;">
      Best regards,<br>
      <strong style="color:#1e293b;">The CyberteksIT Team</strong>
    </p>
  `;
  return layout('linear-gradient(135deg,#1e293b,#334155)', 'Application Update', 'Thank you for applying', body);
}
