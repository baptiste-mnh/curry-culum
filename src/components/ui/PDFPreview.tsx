import { PDFViewer } from "@react-pdf/renderer";
import { useState, useEffect, useMemo } from "react";
import { CVData } from "../../types/cv";

interface PDFPreviewProps {
  template: React.ComponentType<{ cvData: CVData }>;
  cvData: CVData;
  debounceMs?: number; // Default to 500ms
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  template: TemplateComponent,
  cvData,
  debounceMs = 500,
}) => {
  const [debouncedCvData, setDebouncedCvData] = useState<CVData>(cvData);

  // Debounce the cvData updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCvData(cvData);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [cvData, debounceMs]);

  // Memoize the PDF component to prevent unnecessary re-renders
  const pdfComponent = useMemo(() => {
    return <TemplateComponent cvData={debouncedCvData} />;
  }, [TemplateComponent, debouncedCvData]);

  return (
    <div className="h-full w-full">
      <PDFViewer className="w-full h-full" showToolbar={true}>
        {pdfComponent}
      </PDFViewer>
    </div>
  );
};

export default PDFPreview;
