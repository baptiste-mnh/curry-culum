import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFExportOptions {
  format?: "A4" | "Letter";
  orientation?: "portrait" | "landscape";
  margin?: number;
  quality?: number;
}

export const exportToPDFAdvanced = async (
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> => {
  const {
    format = "A4",
    orientation = "portrait",
    margin = 10,
    quality = 2,
  } = options;

  try {
    // Calculate page dimensions
    const pageWidth = format === "A4" ? 210 : 216; // mm
    const pageHeight = format === "A4" ? 297 : 279; // mm
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    // Create canvas with high quality
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Calculate number of pages needed
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const scaleX = contentWidth / canvasWidth;
    const scaleY = contentHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY);

    const scaledWidth = canvasWidth * scale;
    const scaledHeight = canvasHeight * scale;
    const pagesNeeded = Math.ceil(scaledHeight / contentHeight);

    // Create PDF
    const pdf = new jsPDF({
      format,
      orientation,
      unit: "mm",
    });

    // Add pages and content
    for (let page = 0; page < pagesNeeded; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const sourceY = page * (contentHeight / scale);
      const sourceHeight = Math.min(
        contentHeight / scale,
        canvasHeight - sourceY
      );

      // Create temporary canvas for this page
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      if (!pageCtx) throw new Error("Failed to get canvas context");

      pageCanvas.width = canvasWidth;
      pageCanvas.height = sourceHeight;

      // Draw the portion of the original canvas
      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        canvasWidth,
        sourceHeight,
        0,
        0,
        canvasWidth,
        sourceHeight
      );

      // Convert to image and add to PDF
      const pageImageData = pageCanvas.toDataURL("image/png", 1.0);
      pdf.addImage(
        pageImageData,
        "PNG",
        margin,
        margin,
        scaledWidth,
        Math.min(scaledHeight, contentHeight)
      );
    }

    // Save the PDF
    pdf.save("cv.pdf");
  } catch (error) {
    console.error("PDF export failed:", error);
    throw new Error("Failed to export PDF");
  }
};

// Utility function to check if content fits on one page
export const estimatePageCount = (
  element: HTMLElement,
  format: "A4" | "Letter" = "A4"
): number => {
  const pageHeight = format === "A4" ? 297 : 279; // mm
  const contentHeight = element.scrollHeight;
  const scale = 210 / element.scrollWidth; // Assuming A4 width
  const scaledHeight = contentHeight * scale;

  return Math.ceil(scaledHeight / pageHeight);
};

// Utility function to optimize content for PDF export
export const optimizeForPDF = (element: HTMLElement): void => {
  // Ensure all images are loaded
  const images = element.querySelectorAll("img");
  images.forEach((img) => {
    if (!img.complete) {
      img.style.display = "none";
    }
  });

  // Ensure proper font loading
  const style = document.createElement("style");
  style.textContent = `
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
  `;
  document.head.appendChild(style);
};
