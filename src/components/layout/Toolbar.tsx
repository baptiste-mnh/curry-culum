import sampleJson from "@/assets/sample.json";
import { AVAILABLE_TEMPLATES } from "@/components/templates";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { exportCVDataToJSON } from "@/utils/cv";
import { Download, Globe, Menu, RotateCcw } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import faviconImage from "/favicon.ico";

const Toolbar: React.FC = () => {
  const { cvData, setTemplate, setLanguage, resetCV } = useCVDataContext();

  const handleTemplateChange = (templateId: string) => {
    setTemplate(templateId);
    toast.success("Template changed successfully");
  };

  const handleLanguageToggle = () => {
    const newLanguage = cvData.language === "fr" ? "en" : "fr";
    setLanguage(newLanguage);
    toast.success(`Language changed to ${newLanguage.toUpperCase()}`);
  };

  const handleExportJSON = () => {
    try {
      const jsonData = exportCVDataToJSON(cvData);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cv-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("CV data exported successfully");
    } catch (_error) {
      console.error(_error);
      toast.error("Failed to export CV data");
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all data? This action cannot be undone."
      )
    ) {
      resetCV();
      toast.success("CV data reset successfully");
    }
  };

  const handleGetJSONTemplate = () => {
    const jsonString = JSON.stringify(sampleJson, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curry-culum-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full border-b border-gray-200 px-4 py-3 print:hidden max-w-screen-lg overflow-y-auto">
      <div className="flex items-center justify-between w-full gap-2G">
        {/* Home Button - Always visible */}
        <Button
          onClick={() => {
            window.location.href = "/";
          }}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <img
            src={faviconImage}
            alt="Curry Culum"
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            Curry Culum
          </span>
        </Button>

        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden md:flex justify-between items-center space-x-4 w-full">
          {/* Template Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Template:</span>
            <Select
              value={cvData.template}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLanguageToggle}
            className="flex items-center space-x-2"
          >
            <Globe className="h-4 w-4" />
            <span>{cvData.language.toUpperCase()}</span>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Export and Reset Buttons */}
          <Button
            variant="outline"
            onClick={handleGetJSONTemplate}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Get JSON Template</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleExportJSON}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Save JSON</span>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Mobile Popover - Visible only on mobile */}
        <div className="md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 m-2">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium">Options</h4>
                  <p className="text-muted-foreground text-sm">
                    Manage your CV settings and data.
                  </p>
                </div>

                <div className="grid gap-3">
                  {/* Template Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template</label>
                    <Select
                      value={cvData.template}
                      onValueChange={handleTemplateChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_TEMPLATES.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <Button
                      variant="outline"
                      onClick={handleLanguageToggle}
                      className="w-full flex items-center justify-between"
                    >
                      <span>Current: {cvData.language.toUpperCase()}</span>
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  {/* Export Buttons */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Export</label>
                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        onClick={handleGetJSONTemplate}
                        className="w-full flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Get JSON Template</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleExportJSON}
                        className="w-full flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Save JSON</span>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Reset Button */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Data Management
                    </label>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full flex items-center space-x-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset All Data</span>
                    </Button>
                  </div>

                  <Separator />

                  {/* PWA Installation */}
                  {/* <div className="space-y-2">
                    <label className="text-sm font-medium">Application</label>
                    <InstallPWAButton />
                  </div> */}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
