import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  DownloadIcon,
  Maximize2,
  X,
} from "lucide-react";

interface PagePreviewProps {
  children: React.ReactNode;
}

const PagePreview: React.FC<PagePreviewProps> = ({ children }) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleDownload = () => {
    // Open in new window/tab
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-gray-50 print:relative print:inset-auto print:z-auto print:overflow-visible print:bg-white">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 print:hidden">
          <h2 className="text-lg font-semibold text-gray-800">
            CV Preview - Fullscreen Mode
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExitFullscreen}
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Close (Esc)</span>
          </Button>
        </div>

        <div className="flex justify-center p-4 print:p-0">
          <div
            id="page-preview-wrapper-fullscreen"
            className="bg-white shadow-lg print:shadow-none"
            style={{
              width: "210mm",
              minHeight: "297mm",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 print:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Zoom:</span>
          <span className="text-sm text-gray-600">{zoom}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="flex items-center space-x-2"
          >
            <Maximize2 className="h-4 w-4" />
            <span>Fullscreen</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4">
        <div
          id="page-preview-wrapper"
          className="mx-auto bg-white shadow-lg"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            width: "210mm",
            minHeight: "297mm",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PagePreview;
