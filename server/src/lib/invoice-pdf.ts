import PDFDocument from 'pdfkit';

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

// Primary blue
const BLUE  = '#102a83';
const LIGHT = '#e8edf7';
const GRAY  = '#64748b';
const DARK  = '#111827';

function fmt(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-UG')}`;
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: `Invoice ${data.invoiceNo}` } });

    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width - 100; // usable width

    // ── Header band ──────────────────────────────────────────────────────────
    doc.rect(50, 50, W, 72).fill(BLUE);

    doc.fillColor('white')
       .font('Helvetica-Bold').fontSize(22)
       .text('CYBERTEKS-IT LTD', 70, 64);

    doc.font('Helvetica').fontSize(9).fillColor('rgba(255,255,255,0.7)')
       .text('Kampala, Uganda  ·  info@cyberteks-it.com  ·  cyberteks-it.com', 70, 90);

    doc.font('Helvetica-Bold').fontSize(26).fillColor('white')
       .text('INVOICE', W - 50, 64, { align: 'right', width: 120 });

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
       .text('✓  PAID', 424, metaTop + 24);

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

    // Table header
    doc.rect(50, tableTop, W, 26).fill(BLUE);
    doc.font('Helvetica-Bold').fontSize(9).fillColor('white')
       .text('DESCRIPTION', 70, tableTop + 9)
       .text('AMOUNT', W - 20, tableTop + 9, { align: 'right', width: 80 });

    // Rows
    let y = tableTop + 26;
    data.items.forEach((item, i) => {
      const rowBg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
      doc.rect(50, y, W, 30).fill(rowBg);
      doc.font('Helvetica').fontSize(10).fillColor(DARK)
         .text(item.description, 70, y + 10, { width: W - 150 });
      doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK)
         .text(fmt(item.amount, data.currency), W - 20, y + 10, { align: 'right', width: 80 });
      y += 30;
    });

    // Total row
    doc.rect(50, y, W, 36).fill(LIGHT);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(GRAY)
       .text('TOTAL', 70, y + 12);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(BLUE)
       .text(fmt(data.total, data.currency), W - 20, y + 10, { align: 'right', width: 80 });

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
    const footerY = doc.page.height - 60;
    doc.rect(50, footerY, W, 1).fill(LIGHT);
    doc.font('Helvetica').fontSize(8).fillColor(GRAY)
       .text(
         'Cyberteks-IT Ltd  ·  Kampala, Uganda  ·  info@cyberteks-it.com  ·  cyberteks-it.com',
         50, footerY + 10, { width: W, align: 'center' },
       );

    doc.end();
  });
}
