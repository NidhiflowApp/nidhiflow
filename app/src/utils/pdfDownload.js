import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDFReport = async (fileName = "NidhiFlow-Report.pdf") => {
  try {
    const element = document.getElementById("pdf-report");

    if (!element) {
      console.error("PDF element not found");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);

  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};