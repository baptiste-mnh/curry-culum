import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export interface PDFExportOptions {
  filename?: string;
  format?: "a4" | "letter";
  quality?: number;
  margin?: number;
}

export const exportToPDF = async (
  elementId: string,
  options: PDFExportOptions = {}
): Promise<void> => {
  const {
    filename = "cv.pdf",
    format = "a4",
    quality = 1,
    margin = 10,
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    // Show loading state
    const loadingElement = document.createElement("div");
    loadingElement.innerHTML = "Generating PDF...";
    loadingElement.style.position = "fixed";
    loadingElement.style.top = "50%";
    loadingElement.style.left = "50%";
    loadingElement.style.transform = "translate(-50%, -50%)";
    loadingElement.style.zIndex = "9999";
    loadingElement.style.padding = "20px";
    loadingElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    loadingElement.style.color = "white";
    loadingElement.style.borderRadius = "8px";
    document.body.appendChild(loadingElement);

    // Configure canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: (window.devicePixelRatio || 1) * quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    // Calculate PDF dimensions
    const imgWidth = format === "a4" ? 210 : 216; // A4: 210mm, Letter: 216mm
    const imgHeight = format === "a4" ? 297 : 279; // A4: 297mm, Letter: 279mm

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate scaling to fit page with margins
    const availableWidth = imgWidth - margin * 2;
    const availableHeight = imgHeight - margin * 2;

    const scale = Math.min(
      availableWidth / (canvasWidth * 0.264583), // Convert px to mm
      availableHeight / (canvasHeight * 0.264583)
    );

    const scaledWidth = canvasWidth * 0.264583 * scale;
    const scaledHeight = canvasHeight * 0.264583 * scale;

    // Create PDF
    const pdf = new jsPDF({
      orientation: scaledHeight > scaledWidth ? "portrait" : "landscape",
      unit: "mm",
      format: format === "a4" ? "a4" : "letter",
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    // Center the image on the page
    const x = (imgWidth - scaledWidth) / 2;
    const y = (imgHeight - scaledHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);

    // Handle multi-page content if needed
    if (scaledHeight > availableHeight) {
      let remainingHeight = scaledHeight;
      let currentY = 0;

      while (remainingHeight > 0) {
        if (currentY > 0) {
          pdf.addPage();
        }

        const pageHeight = Math.min(remainingHeight, availableHeight);
        pdf.addImage(
          imgData,
          "PNG",
          x,
          y - currentY,
          scaledWidth,
          scaledHeight
        );

        currentY += pageHeight;
        remainingHeight -= pageHeight;
      }
    }

    // Save the PDF
    pdf.save(filename);

    // Remove loading element
    document.body.removeChild(loadingElement);
  } catch (error) {
    console.error("Error generating PDF:", error);

    // Remove loading element if it exists
    const loadingElement = document.querySelector('[style*="Generating PDF"]');
    if (loadingElement) {
      document.body.removeChild(loadingElement);
    }

    throw new Error("Failed to generate PDF. Please try again.");
  }
};

export const validatePDFElement = (elementId: string): boolean => {
  const element = document.getElementById(elementId);
  return (
    element !== null && element.offsetWidth > 0 && element.offsetHeight > 0
  );
};
