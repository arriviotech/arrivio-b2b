import jsPDF from 'jspdf';

export const generateNativePDF = async (groupedProperties, asBlob = false) => {
  if (!groupedProperties || groupedProperties.length === 0) return;

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = 20;

  // Helper function to check for page break
  const checkPageBreak = (neededSpace) => {
    if (yPos + neededSpace > 280) {
      pdf.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // 1. Unified Header (on first page)
  pdf.setFontSize(26);
  pdf.setTextColor(30, 111, 80); // #1e6f50
  pdf.setFont(undefined, 'bold');
  pdf.text('Arrivio', margin, yPos);

  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.setFont(undefined, 'normal');
  pdf.text('ACCOMMODATION & SERVICES OFFER', margin, yPos + 7);

  pdf.setFontSize(9);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 35, yPos);

  yPos += 25;

  // 2. Section 1: Accommodations & Integrated Services
  const housingProperties = groupedProperties.filter(p => p.id !== 'services');

  if (housingProperties.length > 0) {
    pdf.setFontSize(14);
    pdf.setTextColor(26, 43, 60);
    pdf.setFont(undefined, 'bold');
    pdf.text('Selected Accommodations', margin, yPos);
    yPos += 10;

    housingProperties.forEach((property) => {
      checkPageBreak(50);

      // Property Header
      pdf.setFillColor(248, 250, 249);
      pdf.rect(margin, yPos, contentWidth, 12, 'F');

      pdf.setFontSize(11);
      pdf.setTextColor(26, 43, 60);
      pdf.setFont(undefined, 'bold');
      pdf.text(property.name.toUpperCase(), margin + 5, yPos + 8);

      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont(undefined, 'normal');
      pdf.text(`${property.neighborhood}, ${property.city}`, pageWidth - margin - 5, yPos + 8, { align: 'right' });

      yPos += 18;

      // Units Table Header
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('UNIT TYPE', margin + 5, yPos);
      pdf.text('QTY', margin + 120, yPos, { align: 'center' });
      pdf.text('PRICE/MO', margin + 145, yPos, { align: 'right' });
      pdf.text('TOTAL/MO', pageWidth - margin - 5, yPos, { align: 'right' });

      yPos += 4;
      pdf.setDrawColor(240, 240, 240);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Split units into housing and services
      const housingUnits = property.units.filter(u => u.unitPrice > 0);
      const propertyServices = property.units.filter(u => u.unitPrice === 0);

      // Units Rows
      housingUnits.forEach(unit => {
        checkPageBreak(15);

        pdf.setFontSize(10);
        pdf.setTextColor(26, 43, 60);
        pdf.setFont(undefined, 'bold');
        pdf.text(unit.unitType, margin + 5, yPos);

        pdf.setFontSize(10);
        pdf.setTextColor(30, 111, 80);
        pdf.text(unit.quantity.toString(), margin + 120, yPos, { align: 'center' });

        pdf.setTextColor(100, 100, 100);
        pdf.setFont(undefined, 'normal');
        pdf.text(`€${unit.unitPrice.toLocaleString()}`, margin + 145, yPos, { align: 'right' });

        pdf.setTextColor(26, 43, 60);
        pdf.setFont(undefined, 'bold');
        pdf.text(`€${(unit.unitPrice * unit.quantity).toLocaleString()}`, pageWidth - margin - 5, yPos, { align: 'right' });

        yPos += 10;
      });

      // Integrated Services for this Property
      if (propertyServices.length > 0) {
        checkPageBreak(25);
        yPos += 2;
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont(undefined, 'bold');
        pdf.text('Additional Services for this Property:', margin + 5, yPos);
        yPos += 6;

        propertyServices.forEach(service => {
          checkPageBreak(10);
          pdf.setFontSize(9);
          pdf.setTextColor(26, 43, 60);
          pdf.setFont(undefined, 'normal');
          pdf.text(`• ${service.unitType}`, margin + 8, yPos);

          pdf.setTextColor(30, 111, 80);
          pdf.setFont(undefined, 'bold');
          pdf.text(`Qty: ${service.quantity}`, pageWidth - margin - 10, yPos, { align: 'right' });
          yPos += 6;
        });
      }

      yPos += 10;
    });

    // 2.5 Overall Summary Table
    checkPageBreak(50);
    yPos += 10;

    pdf.setFontSize(14);
    pdf.setTextColor(26, 43, 60);
    pdf.setFont(undefined, 'bold');
    pdf.text('Overall Summary', margin, yPos);
    yPos += 10;

    // Summary Table Header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos, contentWidth, 10, 'F');

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('PROPERTY', margin + 5, yPos + 7);
    pdf.text('TOTAL UNITS', margin + 120, yPos + 7, { align: 'center' });
    pdf.text('MONTHLY TOTAL', pageWidth - margin - 5, yPos + 7, { align: 'right' });

    yPos += 18;

    housingProperties.forEach(property => {
      checkPageBreak(12);

      const housingUnits = property.units.filter(u => u.unitPrice > 0);
      const propUnitsTotal = housingUnits.reduce((sum, u) => sum + u.quantity, 0);
      const propPriceTotal = housingUnits.reduce((sum, u) => sum + (u.unitPrice * u.quantity), 0);

      pdf.setFontSize(10);
      pdf.setTextColor(26, 43, 60);
      pdf.setFont(undefined, 'bold');
      pdf.text(property.name, margin + 5, yPos);

      pdf.setFontSize(10);
      pdf.setTextColor(30, 111, 80);
      pdf.text(propUnitsTotal.toString(), margin + 120, yPos, { align: 'center' });

      pdf.setTextColor(26, 43, 60);
      pdf.text(`€${propPriceTotal.toLocaleString()}`, pageWidth - margin - 5, yPos, { align: 'right' });

      yPos += 8;
      pdf.setDrawColor(245, 245, 245);
      pdf.line(margin + 5, yPos, pageWidth - margin - 5, yPos);
      yPos += 8;
    });
  }

  // 4. Section 3: Summary & Footer
  checkPageBreak(50);
  yPos += 15;

  const housingTotal = housingProperties.reduce((acc, p) =>
    acc + p.units.reduce((sum, u) => sum + (u.unitPrice * u.quantity), 0), 0
  );

  pdf.setFillColor(26, 43, 60);
  pdf.rect(margin, yPos, contentWidth, 30, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text('ESTIMATED MONTHLY TOTAL (EXCL. SERVICES)', margin + 10, yPos + 12);

  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text(`€${housingTotal.toLocaleString()}`, pageWidth - margin - 10, yPos + 20, { align: 'right' });

  yPos += 45;

  pdf.setFontSize(8);
  pdf.setTextColor(180, 180, 180);
  pdf.setFont(undefined, 'normal');
  pdf.text('This is an estimated proposal based on current availability. Rates and capacity are subject to change.', pageWidth / 2, yPos, { align: 'center' });
  pdf.text('www.arrivio.com | contact@arrivio.com | +1 234 567 890', pageWidth / 2, yPos + 5, { align: 'center' });

  if (asBlob) {
    return pdf.output('blob');
  } else {
    pdf.save(`Arrivio Business Proposal ${new Date().toISOString().slice(0, 10)}.pdf`);
  }
};