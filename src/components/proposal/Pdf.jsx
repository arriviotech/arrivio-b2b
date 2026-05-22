import jsPDF from 'jspdf';

// Brand palette
const GREEN = [15, 76, 58];        // #0f4c3a — primary brand
const GREEN_DARK = [10, 58, 43];   // #0a3a2b — accent
const DARK = [17, 24, 39];         // #111827 — body text
const MUTED = [107, 114, 128];     // #6b7280 — labels
const SOFT = [156, 163, 175];      // #9ca3af — disclaimers
const LIGHTBG = [244, 247, 246];   // #f4f7f6 — section header bg
const BORDER = [229, 231, 235];    // #e5e7eb
const WHITE = [255, 255, 255];
const GREEN_TINT = [200, 220, 210]; // light label on green

const generateProposalId = () => {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AR-${ymd}-${rand}`;
};

export const generateNativePDF = async (...args) => {
  // Backward-compat signature: (groupedProperties, asBlob)
  // New signature: ({ groupedProperties, services, additionalNotes, estimatedMonthlyCost, cityCounts, asBlob })
  let options;
  if (Array.isArray(args[0])) {
    options = { groupedProperties: args[0], asBlob: args[1] === true };
  } else {
    options = args[0] || {};
  }

  const {
    groupedProperties = [],
    services = [],
    additionalNotes = '',
    estimatedMonthlyCost = 0,
    cityCounts = [],
    asBlob = false,
  } = options;

  if (!groupedProperties || groupedProperties.length === 0) return;

  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const footerHeight = 22;
  let yPos = margin;

  // Helpers
  const setText = (size, weight = 'normal', color = DARK) => {
    pdf.setFontSize(size);
    pdf.setFont(undefined, weight);
    pdf.setTextColor(color[0], color[1], color[2]);
  };
  const fillRect = (x, y, w, h, color) => {
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.rect(x, y, w, h, 'F');
  };
  const line = (x1, y1, x2, y2, color = BORDER) => {
    pdf.setDrawColor(color[0], color[1], color[2]);
    pdf.line(x1, y1, x2, y2);
  };
  const checkPageBreak = (needed) => {
    if (yPos + needed > pageHeight - footerHeight) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  const proposalId = generateProposalId();
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // ============================================================
  // HEADER
  // ============================================================
  setText(28, 'bold', GREEN);
  pdf.text('Arrivio', margin, yPos + 6);

  setText(9, 'bold', MUTED);
  pdf.text('BUSINESS  •  HOUSING PROPOSAL', margin, yPos + 12);

  // Right side: date + proposal id
  setText(9, 'normal', DARK);
  pdf.text(dateStr, pageWidth - margin, yPos + 5, { align: 'right' });

  setText(8, 'normal', MUTED);
  pdf.text(`PROPOSAL ID: ${proposalId}`, pageWidth - margin, yPos + 10, { align: 'right' });

  yPos += 18;
  line(margin, yPos, pageWidth - margin, yPos, GREEN);
  yPos += 10;

  // ============================================================
  // SECTION 1: SELECTED ACCOMMODATIONS
  // ============================================================
  setText(15, 'bold', DARK);
  pdf.text('Selected Accommodations', margin, yPos);

  setText(9, 'normal', MUTED);
  const propCount = groupedProperties.length;
  pdf.text(`${propCount} ${propCount === 1 ? 'property' : 'properties'}`, pageWidth - margin, yPos, { align: 'right' });

  yPos += 9;

  groupedProperties.forEach((property) => {
    const housingUnits = property.units.filter((u) => u.unitPrice > 0);
    if (housingUnits.length === 0) return;

    checkPageBreak(housingUnits.length * 8 + 24);

    // Property header strip
    fillRect(margin, yPos, contentWidth, 11, LIGHTBG);

    setText(11, 'bold', DARK);
    pdf.text(property.name, margin + 4, yPos + 7);

    setText(9, 'normal', MUTED);
    const loc = property.neighborhood ? `${property.neighborhood}, ${property.city}` : property.city;
    pdf.text(loc, pageWidth - margin - 4, yPos + 7, { align: 'right' });

    yPos += 14;

    // Table header
    setText(7.5, 'bold', MUTED);
    pdf.text('UNIT TYPE', margin + 2, yPos);
    pdf.text('QTY', margin + 105, yPos, { align: 'right' });
    pdf.text('RATE / MO', margin + 140, yPos, { align: 'right' });
    pdf.text('SUBTOTAL', pageWidth - margin - 2, yPos, { align: 'right' });
    yPos += 1.5;
    line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;

    // Unit rows
    housingUnits.forEach((unit) => {
      checkPageBreak(8);
      const subtotal = Math.round(unit.unitPrice * unit.quantity);

      setText(10, 'normal', DARK);
      pdf.text(unit.unitType, margin + 2, yPos);

      setText(10, 'bold', DARK);
      pdf.text(unit.quantity.toString(), margin + 105, yPos, { align: 'right' });

      setText(10, 'normal', MUTED);
      pdf.text(`EUR ${unit.unitPrice.toLocaleString()}`, margin + 140, yPos, { align: 'right' });

      setText(10, 'bold', GREEN);
      pdf.text(`EUR ${subtotal.toLocaleString()}`, pageWidth - margin - 2, yPos, { align: 'right' });

      yPos += 7;
    });

    yPos += 6;
  });

  // ============================================================
  // SECTION 2: BY CITY (only if multiple cities)
  // ============================================================
  if (cityCounts && cityCounts.length > 1) {
    checkPageBreak(20 + cityCounts.length * 7);
    yPos += 4;

    setText(15, 'bold', DARK);
    pdf.text('By City', margin, yPos);
    yPos += 8;

    cityCounts.forEach(([city, count]) => {
      setText(10, 'normal', DARK);
      pdf.text(city, margin + 2, yPos);

      setText(10, 'bold', GREEN);
      pdf.text(`${count} ${count === 1 ? 'unit' : 'units'}`, pageWidth - margin - 2, yPos, { align: 'right' });

      yPos += 4;
      line(margin, yPos, pageWidth - margin, yPos);
      yPos += 4;
    });

    yPos += 4;
  }

  // ============================================================
  // SECTION 3: RELOCATION SERVICES
  // ============================================================
  if (services && services.length > 0) {
    checkPageBreak(20 + services.length * 7);
    yPos += 4;

    setText(15, 'bold', DARK);
    pdf.text('Relocation Services', margin, yPos);

    setText(9, 'normal', MUTED);
    pdf.text('Final pricing confirmed on the call', pageWidth - margin, yPos, { align: 'right' });
    yPos += 9;

    services.forEach((svc) => {
      checkPageBreak(8);
      setText(10, 'normal', DARK);
      pdf.text(`• ${svc.label}`, margin + 2, yPos);

      if (svc.scalable) {
        setText(10, 'bold', GREEN);
        pdf.text(`x ${svc.qty}`, pageWidth - margin - 2, yPos, { align: 'right' });
      } else {
        setText(9, 'normal', MUTED);
        pdf.text('included', pageWidth - margin - 2, yPos, { align: 'right' });
      }

      yPos += 6;
    });

    yPos += 4;
  }

  // ============================================================
  // SECTION 4: ADDITIONAL NOTES
  // ============================================================
  if (additionalNotes && additionalNotes.trim().length > 0) {
    checkPageBreak(40);
    yPos += 4;

    setText(15, 'bold', DARK);
    pdf.text('Notes from prospect', margin, yPos);
    yPos += 8;

    setText(10, 'normal', DARK);
    const noteLines = pdf.splitTextToSize(additionalNotes.trim(), contentWidth - 4);
    noteLines.forEach((textLine) => {
      checkPageBreak(7);
      pdf.text(textLine, margin + 2, yPos);
      yPos += 5;
    });
    yPos += 4;
  }

  // ============================================================
  // SECTION 5: ESTIMATED MONTHLY TOTAL — branded box
  // ============================================================
  checkPageBreak(38);
  yPos += 6;

  fillRect(margin, yPos, contentWidth, 30, GREEN);

  setText(9, 'bold', GREEN_TINT);
  pdf.text('ESTIMATED MONTHLY TOTAL', margin + 8, yPos + 10);

  setText(7.5, 'normal', GREEN_TINT);
  pdf.text('Housing only. Services and final pricing confirmed on the call.', margin + 8, yPos + 16);

  setText(22, 'bold', WHITE);
  pdf.text(`EUR ${(estimatedMonthlyCost || 0).toLocaleString()}`, pageWidth - margin - 8, yPos + 18, { align: 'right' });

  setText(8, 'normal', GREEN_TINT);
  pdf.text('/ month', pageWidth - margin - 8, yPos + 23, { align: 'right' });

  yPos += 36;

  // ============================================================
  // FOOTER (added to every page at the end)
  // ============================================================
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18, BORDER);

    setText(7.5, 'normal', MUTED);
    pdf.text('arrivio.business  •  hello@arrivio.com', margin, pageHeight - 12);

    setText(7.5, 'normal', MUTED);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 12, { align: 'right' });

    setText(7, 'normal', SOFT);
    pdf.text(
      'This proposal is non-binding. Final terms confirmed by an Arrivio account manager.',
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );
  }

  if (asBlob) {
    return pdf.output('blob');
  } else {
    pdf.save(`Arrivio Proposal ${proposalId}.pdf`);
  }
};
