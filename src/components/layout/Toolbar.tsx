import { AVAILABLE_TEMPLATES } from "@/components/templates";
import { Button } from "@/components/ui/button";
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
import { Download, Globe, RotateCcw } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import faviconImage from "/favicon.ico";
import sampleJson from "@/assets/sample.json";

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
    <div className="bg-white border-b border-gray-200 px-4 py-3 print:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Template Selector */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                window.location.href = "/curry-culum/";
              }}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <img
                src={faviconImage}
                alt="Curry Culum"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">Home</span>
            </Button>
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
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleGetJSONTemplate}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Get JSON Template</span>
          </Button>
          {/* Export JSON */}
          <Button
            variant="outline"
            onClick={handleExportJSON}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Save JSON</span>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Reset */}
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
