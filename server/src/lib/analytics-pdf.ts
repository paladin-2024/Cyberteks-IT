import PDFDocument from 'pdfkit';
import https from 'https';
import http from 'http';

// ── Brand colours ─────────────────────────────────────────────────────────────
const BLUE       = '#102a83';
const BLUE_DARK  = '#0b1e5e';
const BLUE_LIGHT = '#e8edf7';
const RED        = '#E11D48';
const GRAY       = '#64748b';
const GRAY_LIGHT = '#f1f5f9';
const DARK       = '#111827';
const WHITE      = '#ffffff';

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtUGX(n: number): string {
  if (n >= 1_000_000_000) return `UGX ${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `UGX ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `UGX ${(n / 1_000).toFixed(0)}K`;
  return `UGX ${n.toLocaleString('en-UG')}`;
}

function monthName(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

async function fetchLogoBuffer(url: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      if (res.statusCode !== 200) { resolve(null); return; }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end',  () => resolve(Buffer.concat(chunks)));
      res.on('error', () => resolve(null));
    });
    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => { req.destroy(); resolve(null); });
  });
}

// ── Public interface ──────────────────────────────────────────────────────────
export interface AnalyticsReportData {
  month: number;
  year: number;
  kpis: {
    totalStudents: number;
    totalRevenue: number;
    avgCompletion: number;
    retentionRate: number;
    newEnrollmentsThisMonth: number;
    revenueThisMonth: number;
    newApplicationsThisMonth: number;
  };
  enrollmentChart:     Array<{ month: string; students: number }>;
  revenueChart:        Array<{ month: string; revenue: number }>;
  programShare:        Array<{ name: string; value: number }>;
  completionByProgram: Array<{ program: string; rate: number }>;
}

// ── PDF generator ─────────────────────────────────────────────────────────────
export async function generateAnalyticsReport(data: AnalyticsReportData): Promise<Buffer> {
  const logoBuffer = await fetchLogoBuffer('https://cyberteks-it.com/logo.jpg');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      info: {
        Title:  `Cyberteks-IT Monthly Report — ${monthName(data.month, data.year)}`,
        Author: 'Cyberteks-IT LMS',
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data',  (c: Buffer) => chunks.push(c));
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const PW = doc.page.width;  // 595
    const PH = doc.page.height; // 842
    const M  = 40;              // side margin
    const CW = PW - M * 2;     // content width

    // ── Add footer on every new page automatically ────────────────────────────
    doc.on('pageAdded', () => {
      drawFooter(doc, data.month, data.year, PW, PH, M);
    });

    // ════════════════════════════════════════════════════════════════════════
    // COVER HEADER BAND
    // ════════════════════════════════════════════════════════════════════════
    doc.rect(0, 0, PW, 130).fill(BLUE);
    doc.rect(0, 125, PW, 6).fill(RED);   // red accent stripe

    // Logo
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, M, 18, { width: 80, height: 80, fit: [80, 80] });
      } catch {
        doc.circle(M + 40, 58, 36).fill(BLUE_DARK);
        doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('CT', M + 32, 52);
      }
    } else {
      doc.circle(M + 40, 58, 36).fill(BLUE_DARK);
      doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold').text('CT', M + 32, 52);
    }

    // Company name (left side)
    doc.font('Helvetica-Bold').fontSize(22).fillColor(WHITE)
       .text('CYBERTEKS-IT LTD', M + 100, 22, { width: CW - 100 });

    doc.font('Helvetica').fontSize(10).fillColor(WHITE).fillOpacity(0.7)
       .text('ICT Training & Technology Solutions · Kampala, Uganda', M + 100, 50);

    doc.font('Helvetica').fontSize(9).fillColor(WHITE).fillOpacity(0.55)
       .text('info@cyberteks-it.com  ·  cyberteks-it.com', M + 100, 65);

    // Report title (right side) — reset opacity for each text call
    doc.fillOpacity(0.85)
       .font('Helvetica-Bold').fontSize(11).fillColor(WHITE)
       .text('MONTHLY PERFORMANCE REPORT', 0, 25, { width: PW - M, align: 'right' });

    doc.fillOpacity(1)
       .font('Helvetica-Bold').fontSize(20).fillColor(WHITE)
       .text(monthName(data.month, data.year), 0, 44, { width: PW - M, align: 'right' });

    doc.fillOpacity(0.55)
       .font('Helvetica').fontSize(9).fillColor(WHITE)
       .text(
         `Generated: ${new Date().toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' })}`,
         0, 70, { width: PW - M, align: 'right' },
       );

    // Reset opacity for all content below
    doc.fillOpacity(1);

    let y = 148;

    // ════════════════════════════════════════════════════════════════════════
    // SECTION 1 – KPI SUMMARY
    // ════════════════════════════════════════════════════════════════════════
    y = sectionHeader(doc, '1. KEY PERFORMANCE INDICATORS (ALL-TIME)', y, M, CW);

    const kpiBoxW = (CW - 9) / 4;
    const kpiDefs = [
      { label: 'Total Students',  value: String(data.kpis.totalStudents),    color: '#3b82f6' },
      { label: 'Total Revenue',   value: fmtUGX(data.kpis.totalRevenue),     color: '#10b981' },
      { label: 'Avg. Completion', value: `${data.kpis.avgCompletion}%`,       color: '#8b5cf6' },
      { label: 'Retention Rate',  value: `${data.kpis.retentionRate}%`,       color: '#f59e0b' },
    ];
    kpiDefs.forEach((k, i) => {
      const bx = M + i * (kpiBoxW + 3);
      doc.roundedRect(bx, y, kpiBoxW, 68, 6).fill(GRAY_LIGHT);
      doc.rect(bx, y, 4, 68).fill(k.color);
      doc.font('Helvetica-Bold').fontSize(20).fillColor(DARK)
         .text(k.value, bx + 12, y + 14, { width: kpiBoxW - 16 });
      doc.font('Helvetica').fontSize(8).fillColor(GRAY)
         .text(k.label, bx + 12, y + 40, { width: kpiBoxW - 16 });
    });
    y += 80;

    // Monthly snapshot sub-box
    doc.roundedRect(M, y, CW, 46, 6).fill(BLUE_LIGHT);
    doc.font('Helvetica-Bold').fontSize(9).fillColor(BLUE)
       .text('THIS MONTH SNAPSHOT', M + 12, y + 8);

    const snapW = (CW - 36) / 3;
    const snapItems = [
      { label: 'New Enrollments', value: String(data.kpis.newEnrollmentsThisMonth) },
      { label: 'Month Revenue',   value: fmtUGX(data.kpis.revenueThisMonth) },
      { label: 'Applications',    value: String(data.kpis.newApplicationsThisMonth) },
    ];
    snapItems.forEach((s, i) => {
      const sx = M + 12 + i * (snapW + 6);
      doc.font('Helvetica-Bold').fontSize(14).fillColor(BLUE_DARK)
         .text(s.value, sx, y + 22, { width: snapW });
      doc.font('Helvetica').fontSize(7.5).fillColor(GRAY)
         .text(s.label, sx + 48, y + 27, { width: snapW - 50 });
    });
    y += 60;

    // ════════════════════════════════════════════════════════════════════════
    // SECTION 2 – MONTHLY ENROLLMENT TREND
    // ════════════════════════════════════════════════════════════════════════
    y = sectionHeader(doc, '2. MONTHLY ENROLLMENT TREND (LAST 12 MONTHS)', y, M, CW);

    const maxStudents = Math.max(...data.enrollmentChart.map(d => d.students), 1);
    const barW2  = Math.floor((CW - 4) / data.enrollmentChart.length) - 2;
    const chartH = 70;
    data.enrollmentChart.forEach((d, i) => {
      const bx = M + i * (barW2 + 2);
      const bh = Math.max(2, Math.round((d.students / maxStudents) * chartH));
      doc.rect(bx, y + chartH - bh, barW2, bh).fill(BLUE);
      doc.font('Helvetica').fontSize(6).fillColor(GRAY)
         .text(d.month, bx, y + chartH + 2, { width: barW2, align: 'center' });
      if (d.students > 0) {
        doc.font('Helvetica-Bold').fontSize(6).fillColor(DARK)
           .text(String(d.students), bx, y + chartH - bh - 9, { width: barW2, align: 'center' });
      }
    });
    y += chartH + 18;

    y = tableHeader(doc, ['Month', 'New Enrollments'], [60], y, M, CW, BLUE);
    let stripe = false;
    for (const d of data.enrollmentChart) {
      y = tableRow(doc, [d.month, String(d.students)], [60], y, M, CW, stripe);
      stripe = !stripe;
    }
    y += 10;

    if (y > PH - 200) { doc.addPage({ size: 'A4', margin: 0 }); y = 40; }

    // ════════════════════════════════════════════════════════════════════════
    // SECTION 3 – REVENUE BREAKDOWN
    // ════════════════════════════════════════════════════════════════════════
    y = sectionHeader(doc, '3. REVENUE BREAKDOWN (LAST 12 MONTHS)', y, M, CW);

    const maxRev  = Math.max(...data.revenueChart.map(d => d.revenue), 1);
    const barW3   = Math.floor((CW - 4) / data.revenueChart.length) - 2;
    const chartH3 = 70;
    data.revenueChart.forEach((d, i) => {
      const bx = M + i * (barW3 + 2);
      const bh = Math.max(2, Math.round((d.revenue / maxRev) * chartH3));
      doc.rect(bx, y + chartH3 - bh, barW3, bh).fill('#10b981');
      doc.font('Helvetica').fontSize(6).fillColor(GRAY)
         .text(d.month, bx, y + chartH3 + 2, { width: barW3, align: 'center' });
    });
    y += chartH3 + 18;

    y = tableHeader(doc, ['Month', 'Revenue (UGX)'], [60], y, M, CW, '#10b981');
    stripe = false;
    for (const d of data.revenueChart) {
      y = tableRow(doc, [d.month, d.revenue > 0 ? fmtUGX(d.revenue) : '—'], [60], y, M, CW, stripe);
      stripe = !stripe;
    }
    y += 10;

    if (y > PH - 200) { doc.addPage({ size: 'A4', margin: 0 }); y = 40; }

    // ════════════════════════════════════════════════════════════════════════
    // SECTION 4 – PROGRAM COMPLETION RATES
    // ════════════════════════════════════════════════════════════════════════
    y = sectionHeader(doc, '4. PROGRAM COMPLETION RATES', y, M, CW);

    if (data.completionByProgram.length === 0) {
      doc.font('Helvetica').fontSize(9).fillColor(GRAY)
         .text('No completion data available.', M, y);
      y += 20;
    } else {
      y = tableHeader(doc, ['Programme', 'Completion Rate', 'Visual'], [200, 100], y, M, CW, '#8b5cf6');
      stripe = false;
      for (const p of data.completionByProgram) {
        const rowY = y;
        y = tableRow(doc, [p.program, `${p.rate}%`, ''], [200, 100], y, M, CW, stripe);
        const barX    = M + 200 + 100 + 8;
        const barMaxW = CW - 200 - 100 - 16;
        const barW    = Math.max(2, Math.round((p.rate / 100) * barMaxW));
        const barColor = p.rate >= 85 ? '#22c55e' : p.rate >= 70 ? '#3b82f6' : '#f59e0b';
        doc.rect(barX, rowY + 4, barW, 10).fill(barColor);
        stripe = !stripe;
      }
      // Legend
      y += 6;
      [
        ['Excellent \u226585%', '#22c55e'],
        ['Good 70\u201384%',    '#3b82f6'],
        ['Needs attention <70%', '#f59e0b'],
      ].forEach(([lbl, col], i) => {
        doc.rect(M + i * 140, y, 8, 8).fill(col);
        doc.font('Helvetica').fontSize(7.5).fillColor(GRAY)
           .text(lbl, M + i * 140 + 12, y + 0.5, { width: 128 });
      });
      y += 20;
    }

    if (y > PH - 160) { doc.addPage({ size: 'A4', margin: 0 }); y = 40; }

    // ════════════════════════════════════════════════════════════════════════
    // SECTION 5 – PROGRAM DISTRIBUTION
    // ════════════════════════════════════════════════════════════════════════
    y = sectionHeader(doc, '5. STUDENT DISTRIBUTION BY PROGRAM', y, M, CW);

    const totalInDist = data.programShare.reduce((s, p) => s + p.value, 0) || 1;
    if (data.programShare.length === 0) {
      doc.font('Helvetica').fontSize(9).fillColor(GRAY)
         .text('No distribution data available.', M, y);
      y += 20;
    } else {
      y = tableHeader(doc, ['Program / Category', 'Students', 'Share %'], [220, 80], y, M, CW, '#f59e0b');
      stripe = false;
      const distColors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899','#84cc16'];
      for (let i = 0; i < data.programShare.length; i++) {
        const p     = data.programShare[i];
        const share = ((p.value / totalInDist) * 100).toFixed(1);
        y = tableRow(doc, [p.name, String(p.value), `${share}%`], [220, 80], y, M, CW, stripe);
        doc.circle(M + 6, y - 11, 4).fill(distColors[i % distColors.length]);
        stripe = !stripe;
      }
      y += 6;
    }

    // ── Footer on the first (and possibly only) page ──────────────────────────
    // Additional pages get their footer via the 'pageAdded' event above.
    drawFooter(doc, data.month, data.year, PW, PH, M);

    doc.end();
  });
}

// ── Layout helpers ─────────────────────────────────────────────────────────────

function sectionHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  y: number,
  M: number,
  CW: number,
): number {
  doc.rect(M, y, CW, 22).fill(BLUE);
  doc.rect(M, y, 4, 22).fill(RED);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(WHITE)
     .text(title, M + 10, y + 7, { width: CW - 20 });
  return y + 30;
}

function tableHeader(
  doc: PDFKit.PDFDocument,
  cols: string[],
  colWidths: number[],
  y: number,
  M: number,
  CW: number,
  color: string,
): number {
  // Use a fixed light background instead of opacity hex tricks
  doc.rect(M, y, CW, 18).fill(GRAY_LIGHT);
  doc.rect(M, y, 3, 18).fill(color);   // colour left accent bar
  let x = M + 12;
  cols.forEach((col, i) => {
    const w = i < colWidths.length
      ? colWidths[i]
      : CW - colWidths.reduce((a, b) => a + b, 0) - 12;
    doc.font('Helvetica-Bold').fontSize(8).fillColor(DARK)
       .text(col, x, y + 5, { width: w });
    x += w;
  });
  return y + 20;
}

function tableRow(
  doc: PDFKit.PDFDocument,
  cols: string[],
  colWidths: number[],
  y: number,
  M: number,
  CW: number,
  stripe: boolean,
): number {
  const rowH = 18;
  if (stripe) doc.rect(M, y, CW, rowH).fill(GRAY_LIGHT);
  // draw border manually to avoid stroke colour inheritance issues
  doc.moveTo(M, y + rowH).lineTo(M + CW, y + rowH).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
  let x = M + 12;
  cols.forEach((col, i) => {
    const w = i < colWidths.length
      ? colWidths[i]
      : CW - colWidths.reduce((a, b) => a + b, 0) - 12;
    doc.font('Helvetica').fontSize(8.5).fillColor(DARK)
       .text(col, x, y + 5, { width: w });
    x += w;
  });
  return y + rowH;
}

function drawFooter(
  doc: PDFKit.PDFDocument,
  month: number,
  year: number,
  PW: number,
  PH: number,
  M: number,
): void {
  const fy = PH - 36;
  doc.rect(0, fy, PW, 36).fill(BLUE);
  doc.font('Helvetica').fontSize(8).fillColor(WHITE).fillOpacity(0.65)
     .text(
       `Cyberteks-IT Ltd  ·  Kampala, Uganda  ·  info@cyberteks-it.com  ·  cyberteks-it.com  ·  Report: ${monthName(month, year)}`,
       M, fy + 13, { width: PW - M * 2, align: 'center' },
     );
  doc.fillOpacity(1); // reset
}
