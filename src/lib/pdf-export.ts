import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportReportAsPdf(elementId: string, businessName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#f5f6fa",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = pdfWidth / imgWidth;
  const totalPdfHeight = imgHeight * ratio;
  let position = 0;

  // Multi-page support
  while (position < totalPdfHeight) {
    if (position > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, totalPdfHeight);
    position += pdfHeight;
  }

  pdf.save(`${businessName.replace(/\s+/g, "-")}-Digital-Audit-Report.pdf`);
}
