import HomePage from "@/components/layout/HomePage";
import Sidebar from "@/components/layout/Sidebar";
import Toolbar from "@/components/layout/Toolbar";
import { getTemplateComponent } from "@/components/templates";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { useMediaQuery } from "react-responsive";
import { Button } from "./components/ui/button";
import PDFPreview from "./components/ui/PDFPreview";

function AppContent() {
  const { cvData, isLoading, error } = useCVDataContext();
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        {/* Toolbar */}
        <Toolbar />
        {isMobile ? (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* <Sidebar /> */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <Sidebar />
            </div>
            {/* Preview Button */}
            <Drawer direction="bottom">
              <DrawerTrigger asChild>
                <Button className="m-2" variant="outline">
                  See Preview
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full h-full flex flex-col">
                  <DrawerHeader>
                    <DrawerTitle>CV Preview</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex-1 min-h-0">
                    <PDFPreview template={TemplateComponent} cvData={cvData} />
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-hidden">
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
        )}
      </div>
      {/* <Toaster /> */}
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
