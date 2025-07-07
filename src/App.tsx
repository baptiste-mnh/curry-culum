import HomePage from "@/components/layout/HomePage";
import Sidebar from "@/components/layout/Sidebar";
import Toolbar from "@/components/layout/Toolbar";
import { getTemplateComponent } from "@/components/templates";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";
import { CVDataProvider } from "@/contexts/CVDataContext";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { useState } from "react";
import PDFPreview from "./components/ui/PDFPreview";

function AppContent() {
  const { cvData, isLoading, error } = useCVDataContext();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading CV Builder...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Show home page if not editing
  if (!isEditing) {
    return (
      <>
        <HomePage onStartEditing={() => setIsEditing(true)} />
        <Toaster />
      </>
    );
  }

  const TemplateComponent = getTemplateComponent(cvData.template);

  return (
    <>
      <div className="h-screen w-screen flex flex-col">
        {/* Toolbar */}
        <Toolbar />

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel
              defaultSize={30}
              minSize={25}
              maxSize={50}
              className="print:hidden"
            >
              <div className="h-full bg-amber-300 overflow-y-auto">
                <Sidebar />
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={70} className="min-h-0">
              <div className="h-full">
                <PDFPreview template={TemplateComponent} cvData={cvData} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <CVDataProvider>
      <AppContent />
    </CVDataProvider>
  );
}

export default App;
