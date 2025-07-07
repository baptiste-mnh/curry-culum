import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { SkillCategory, CVSection } from "@/types/cv";
import { generateId } from "@/utils/cv";

const SkillsForm: React.FC = () => {
  const { cvData, updateCVData, updateItemPageBreak } = useCVDataContext();
  const [newSkill, setNewSkill] = useState("");

  // Find the skills section
  const skillsSection = cvData.sections.find(
    (section) => section.type === "skillCategories"
  ) as CVSection;
  const skills: SkillCategory[] =
    (skillsSection?.data as SkillCategory[]) || [];

  const addSkillCategory = () => {
    const newCategory: SkillCategory = {
      id: generateId(),
      name: "",
      skills: [],
    };

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "skillCategories") {
        return {
          ...section,
          data: [...skills, newCategory],
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const updateSkillCategory = (id: string, updates: Partial<SkillCategory>) => {
    const updatedSkills = skills.map((category) =>
      category.id === id ? { ...category, ...updates } : category
    );

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "skillCategories") {
        return {
          ...section,
          data: updatedSkills,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const removeSkillCategory = (id: string) => {
    const updatedSkills = skills.filter((category) => category.id !== id);

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "skillCategories") {
        return {
          ...section,
          data: updatedSkills,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const moveSkillCategory = (id: string, direction: "up" | "down") => {
    const currentIndex = skills.findIndex((category) => category.id === id);
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === "up" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === "down" && currentIndex < skills.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return; // Can't move further
    }

    const newSkills = [...skills];
    [newSkills[currentIndex], newSkills[newIndex]] = [
      newSkills[newIndex],
      newSkills[currentIndex],
    ];

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "skillCategories") {
        return {
          ...section,
          data: newSkills,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const addSkill = (categoryId: string) => {
    if (!newSkill.trim()) return;

    const category = skills.find((cat) => cat.id === categoryId);
    if (!category) return;

    const updatedSkills = [...category.skills, newSkill.trim()];
    updateSkillCategory(categoryId, { skills: updatedSkills });
    setNewSkill("");
  };

  const removeSkill = (categoryId: string, skill: string) => {
    const category = skills.find((cat) => cat.id === categoryId);
    if (!category) return;

    const updatedSkills = category.skills.filter((s) => s !== skill);
    updateSkillCategory(categoryId, { skills: updatedSkills });
  };

  const renderSkillCategory = (category: SkillCategory, index: number) => (
    <Card key={category.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Category {index + 1}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveSkillCategory(category.id, "up")}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveSkillCategory(category.id, "down")}
                disabled={index === skills.length - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeSkillCategory(category.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`category-name-${category.id}`}>Category Name</Label>
          <Input
            id={`category-name-${category.id}`}
            value={category.name}
            onChange={(e) =>
              updateSkillCategory(category.id, { name: e.target.value })
            }
            placeholder="Programming Languages, Frameworks, Tools..."
          />
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {category.skills.map((skill, skillIndex) => (
              <Badge
                key={skillIndex}
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(category.id, skill)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(category.id);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => addSkill(category.id)}
              disabled={!newSkill.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`pageBreak-${category.id}`}
            checked={cvData.itemPageBreaks[category.id] || false}
            onCheckedChange={(checked) => {
              updateItemPageBreak(category.id, checked);
            }}
          />
          <Label htmlFor={`pageBreak-${category.id}`}>Move to page start</Label>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Technical Skills</h3>
        <Button onClick={addSkillCategory} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No skill categories added yet.</p>
          <p className="text-sm">Click "Add Category" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {skills.map((category, index) =>
            renderSkillCategory(category, index)
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
