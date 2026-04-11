import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface InvoiceData {
  invoiceNo: string;
  date: Date;
  name: string;
  email: string;
  items: Array<{ description: string; amount: number }>;
  currency: string;
  total: number;
  notes?: string;
}

// Brand colours
const BLUE  = '#102a83';
const LIGHT = '#e8edf7';
const GRAY  = '#64748b';
const DARK  = '#111827';

function fmt(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-UG')}`;
}

function loadLogo(): Buffer | null {
  try {
    return fs.readFileSync(path.join(__dirname, '../../public/logo.jpg'));
  } catch {
    return null;
  }
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: `Invoice ${data.invoiceNo}` } });

    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // W = usable width (595 - 100 = 495). Content: x=50 to x=545.
    const W = doc.page.width - 100;

    // ── Header band ──────────────────────────────────────────────────────────
    doc.rect(50, 50, W, 72).fill(BLUE);

    // Logo (left side of header)
    const logoBuffer = loadLogo();
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, 56, 56, { width: 58, height: 58, fit: [58, 58] });
      } catch {
        // silently skip if image fails
      }
    }

    // Company name — starts after logo
    const textX = logoBuffer ? 124 : 70;
    doc.fillColor('white')
       .font('Helvetica-Bold').fontSize(18)
       .text('CYBERTEKS-IT LTD', textX, 64);

    // Subline — use fillOpacity instead of rgba()
    doc.font('Helvetica').fontSize(8).fillColor('white').fillOpacity(0.7)
       .text('Kampala, Uganda  ·  info@cyberteks-it.com  ·  cyberteks-it.com', textX, 86);

    // "INVOICE" label — right aligned within full content width
    doc.fillOpacity(1)
       .font('Helvetica-Bold').fontSize(26).fillColor('white')
       .text('INVOICE', 50, 62, { align: 'right', width: W });

    // ── Invoice meta ─────────────────────────────────────────────────────────
    const metaTop = 144;
    doc.rect(50, metaTop, W, 52).fill(LIGHT);

    doc.font('Helvetica').fontSize(9).fillColor(GRAY)
       .text('INVOICE NO.',  70, metaTop + 10)
       .text('DATE',        250, metaTop + 10)
       .text('STATUS',      420, metaTop + 10);

    doc.font('Helvetica-Bold').fontSize(11).fillColor(DARK)
       .text(data.invoiceNo, 70, metaTop + 24)
       .text(data.date.toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' }), 250, metaTop + 24);

    // Green "PAID" badge
    doc.roundedRect(420, metaTop + 18, 58, 20, 4).fill('#22c55e');
    doc.font('Helvetica-Bold').fontSize(9).fillColor('white')
       .text('PAID', 430, metaTop + 24);

    // ── Bill To ───────────────────────────────────────────────────────────────
    const billTop = metaTop + 72;
    doc.font('Helvetica-Bold').fontSize(9).fillColor(GRAY)
       .text('BILL TO', 70, billTop);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(DARK)
       .text(data.name, 70, billTop + 14);
    doc.font('Helvetica').fontSize(10).fillColor(GRAY)
       .text(data.email, 70, billTop + 30);

    // ── Line items table ──────────────────────────────────────────────────────
    const tableTop = billTop + 70;

    // Table header — right-align AMOUNT within full content area with right padding
    doc.rect(50, tableTop, W, 26).fill(BLUE);
    doc.font('Helvetica-Bold').fontSize(9).fillColor('white')
       .text('DESCRIPTION', 70, tableTop + 9)
       .text('AMOUNT', 50, tableTop + 9, { align: 'right', width: W - 20 });

    // Rows
    let y = tableTop + 26;
    data.items.forEach((item, i) => {
      const rowBg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
      doc.rect(50, y, W, 30).fill(rowBg);
      doc.font('Helvetica').fontSize(10).fillColor(DARK)
         .text(item.description, 70, y + 10, { width: W - 160 });
      doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK)
         .text(fmt(item.amount, data.currency), 50, y + 10, { align: 'right', width: W - 20 });
      y += 30;
    });

    // Total row
    doc.rect(50, y, W, 36).fill(LIGHT);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(GRAY)
       .text('TOTAL', 70, y + 12);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(BLUE)
       .text(fmt(data.total, data.currency), 50, y + 10, { align: 'right', width: W - 20 });

    // ── Notes / Thank you ─────────────────────────────────────────────────────
    y += 60;
    if (data.notes) {
      doc.font('Helvetica').fontSize(9).fillColor(GRAY)
         .text(data.notes, 70, y, { width: W - 40 });
      y += 30;
    }

    doc.font('Helvetica').fontSize(10).fillColor(GRAY)
       .text('Thank you for choosing Cyberteks-IT. We look forward to supporting your ICT journey!', 70, y, { width: W - 40, align: 'center' });

    // ── Footer line ───────────────────────────────────────────────────────────
    // footerY must stay at least 30px above the bottom margin (doc height - margin = 792)
    // to avoid pdfkit auto-adding a second page.
    const footerY = doc.page.height - 85;
    doc.rect(50, footerY, W, 1).fill(LIGHT);
    doc.font('Helvetica').fontSize(8).fillColor(GRAY)
       .text(
         'Cyberteks-IT Ltd  ·  Kampala, Uganda  ·  info@cyberteks-it.com  ·  cyberteks-it.com',
         50, footerY + 10, { width: W, align: 'center', lineBreak: false },
       );

    doc.end();
  });
}
