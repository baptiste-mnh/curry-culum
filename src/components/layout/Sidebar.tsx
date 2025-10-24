import CertificationsForm from "@/components/forms/CertificationsForm";
import EducationForm from "@/components/forms/EducationForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import InterestsForm from "@/components/forms/InterestsForm";
import LanguagesForm from "@/components/forms/LanguagesForm";
import { PersonalInfoForm } from "@/components/forms/PersonalInfoForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import SkillsForm from "@/components/forms/SkillsForm";
import SoftSkillsForm from "@/components/forms/SoftSkillsForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import ThemeCustomizer from "@/components/ui/ThemeCustomizer";
import { RotateCcw } from "lucide-react";
import { SECTIONS_CONFIG } from "@/constants/sections";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { useTranslation } from "@/hooks/useTranslation";
import { SectionType } from "@/types/cv";
import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const { cvData, updateSectionStartPage, resetPageBreaks } =
    useCVDataContext();
  const { t } = useTranslation();
  const [openSections, setOpenSections] = useState<string[]>(["personalInfo"]);

  const handleSectionToggle = (sectionId: string, isAtPageStart: boolean) => {
    updateSectionStartPage(sectionId as SectionType, isAtPageStart);
  };

  const renderFormComponent = (sectionId: string) => {
    switch (sectionId) {
      case "personalInfo":
        return <PersonalInfoForm />;
      case "experiences":
        return <ExperienceForm />;
      case "education":
        return <EducationForm />;
      case "skillCategories":
        return <SkillsForm />;
      case "softSkills":
        return <SoftSkillsForm />;
      case "languages":
        return <LanguagesForm />;
      case "projects":
        return <ProjectsForm />;
      case "certifications":
        return <CertificationsForm />;
      case "interests":
        return <InterestsForm />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200 print:hidden">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">CV Sections</h2>
          <p className="text-sm text-gray-600">
            Configure your CV content and visibility
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-md font-medium text-gray-900">Theme</h3>
          <ThemeCustomizer />
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-md font-medium text-gray-900">Page Breaks</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={resetPageBreaks}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset all page breaks
          </Button>
          <p className="text-xs text-gray-500">
            Reset all sections and items to start at the same page
          </p>
        </div>

        <Separator />

        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="space-y-2"
        >
          {SECTIONS_CONFIG.map((section) => {
            const isAtPageStart =
              cvData.sectionStartPage[section.id] ?? section.defaultStartPage;

            return (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border rounded-lg"
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <AccordionTrigger className="flex-1 hover:no-underline">
                    <span className="font-medium">{t(section.titleKey)}</span>
                  </AccordionTrigger>
                  <div className="flex items-center space-x-2 ml-2">
                    <Switch
                      id={`toggle-${section.id}`}
                      checked={isAtPageStart}
                      onCheckedChange={(checked) =>
                        handleSectionToggle(section.id, checked)
                      }
                    />
                    <Label htmlFor={`toggle-${section.id}`} className="text-xs">
                      {isAtPageStart
                        ? "Start at new page"
                        : "Start at same page"}
                    </Label>
                  </div>
                </div>
                <AccordionContent className="px-4 pb-4">
                  {renderFormComponent(section.id)}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default Sidebar;
