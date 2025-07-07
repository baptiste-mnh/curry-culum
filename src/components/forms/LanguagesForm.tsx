import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { Language, CVSection, LanguageLevel } from "@/types/cv";
import { generateId } from "@/utils/cv";

const LanguagesForm: React.FC = () => {
  const { cvData, updateCVData } = useCVDataContext();

  // Find the languages section
  const languagesSection = cvData.sections.find(
    (section) => section.type === "languages"
  ) as CVSection;
  const languages: Language[] = (languagesSection?.data as Language[]) || [];

  const languageLevels: LanguageLevel[] = [
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
    "Native",
  ];

  const addLanguage = () => {
    const newLanguage: Language = {
      id: generateId(),
      name: "",
      level: "B2",
    };

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "languages") {
        return {
          ...section,
          data: [...languages, newLanguage],
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const updateLanguage = (id: string, updates: Partial<Language>) => {
    const updatedLanguages = languages.map((lang) =>
      lang.id === id ? { ...lang, ...updates } : lang
    );

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "languages") {
        return {
          ...section,
          data: updatedLanguages,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const removeLanguage = (id: string) => {
    const updatedLanguages = languages.filter((lang) => lang.id !== id);

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "languages") {
        return {
          ...section,
          data: updatedLanguages,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const moveLanguage = (id: string, direction: "up" | "down") => {
    const currentIndex = languages.findIndex((lang) => lang.id === id);
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === "up" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === "down" && currentIndex < languages.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return; // Can't move further
    }

    const newLanguages = [...languages];
    [newLanguages[currentIndex], newLanguages[newIndex]] = [
      newLanguages[newIndex],
      newLanguages[currentIndex],
    ];

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "languages") {
        return {
          ...section,
          data: newLanguages,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const renderLanguageItem = (language: Language, index: number) => (
    <Card key={language.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Language {index + 1}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveLanguage(language.id, "up")}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveLanguage(language.id, "down")}
                disabled={index === languages.length - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeLanguage(language.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`language-name-${language.id}`}>Language</Label>
            <Input
              id={`language-name-${language.id}`}
              value={language.name}
              onChange={(e) =>
                updateLanguage(language.id, { name: e.target.value })
              }
              placeholder="English, French, Spanish..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`language-level-${language.id}`}>Level</Label>
            <Select
              value={language.level}
              onValueChange={(value: LanguageLevel) =>
                updateLanguage(language.id, { level: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Languages</h3>
        <Button onClick={addLanguage} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No languages added yet.</p>
          <p className="text-sm">Click "Add Language" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {languages.map((language, index) =>
            renderLanguageItem(language, index)
          )}
        </div>
      )}
    </div>
  );
};

export default LanguagesForm;
