import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { Experience, CVSection } from "@/types/cv";
import { generateId } from "@/utils/cv";

const ExperienceForm: React.FC = () => {
  const { cvData, updateCVData, updateItemPageBreak } = useCVDataContext();
  const [newTechnology, setNewTechnology] = useState("");

  // Find the experiences section
  const experienceSection = cvData.sections.find(
    (section) => section.type === "experiences"
  ) as CVSection;
  const experiences: Experience[] =
    (experienceSection?.data as Experience[]) || [];

  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      technologies: [],
    };

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "experiences") {
        return {
          ...section,
          data: [...experiences, newExperience],
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    const updatedExperiences = experiences.map((exp) =>
      exp.id === id ? { ...exp, ...updates } : exp
    );

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "experiences") {
        return {
          ...section,
          data: updatedExperiences,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const removeExperience = (id: string) => {
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "experiences") {
        return {
          ...section,
          data: updatedExperiences,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const moveExperience = (id: string, direction: "up" | "down") => {
    const currentIndex = experiences.findIndex((exp) => exp.id === id);
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === "up" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === "down" && currentIndex < experiences.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return; // Can't move further
    }

    const newExperiences = [...experiences];
    [newExperiences[currentIndex], newExperiences[newIndex]] = [
      newExperiences[newIndex],
      newExperiences[currentIndex],
    ];

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "experiences") {
        return {
          ...section,
          data: newExperiences,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const addTechnology = (experienceId: string) => {
    if (!newTechnology.trim()) return;

    const experience = experiences.find((exp) => exp.id === experienceId);
    if (!experience) return;

    const updatedTechnologies = [
      ...experience.technologies,
      newTechnology.trim(),
    ];
    updateExperience(experienceId, { technologies: updatedTechnologies });
    setNewTechnology("");
  };

  const removeTechnology = (experienceId: string, technology: string) => {
    const experience = experiences.find((exp) => exp.id === experienceId);
    if (!experience) return;

    const updatedTechnologies = experience.technologies.filter(
      (tech) => tech !== technology
    );
    updateExperience(experienceId, { technologies: updatedTechnologies });
  };

  const renderExperienceItem = (experience: Experience, index: number) => (
    <Card key={experience.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveExperience(experience.id, "up")}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveExperience(experience.id, "down")}
                disabled={index === experiences.length - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeExperience(experience.id)}
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
            <Label htmlFor={`position-${experience.id}`}>Position</Label>
            <Input
              id={`position-${experience.id}`}
              value={experience.position}
              onChange={(e) =>
                updateExperience(experience.id, { position: e.target.value })
              }
              placeholder="Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`company-${experience.id}`}>Company</Label>
            <Input
              id={`company-${experience.id}`}
              value={experience.company}
              onChange={(e) =>
                updateExperience(experience.id, { company: e.target.value })
              }
              placeholder="Tech Company Inc."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`startDate-${experience.id}`}>Start Date</Label>
            <Input
              id={`startDate-${experience.id}`}
              type="month"
              value={experience.startDate}
              onChange={(e) =>
                updateExperience(experience.id, { startDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
            <Input
              id={`endDate-${experience.id}`}
              type="month"
              value={experience.endDate}
              onChange={(e) =>
                updateExperience(experience.id, { endDate: e.target.value })
              }
              disabled={experience.isCurrent}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`isCurrent-${experience.id}`}
            checked={experience.isCurrent}
            onCheckedChange={(checked) => {
              updateExperience(experience.id, {
                isCurrent: checked as boolean,
                endDate: checked ? "" : experience.endDate,
              });
            }}
          />
          <Label htmlFor={`isCurrent-${experience.id}`}>Current Position</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`pageBreak-${experience.id}`}
            checked={cvData.itemPageBreaks[experience.id] || false}
            onCheckedChange={(checked) => {
              updateItemPageBreak(experience.id, checked);
            }}
          />
          <Label htmlFor={`pageBreak-${experience.id}`}>
            Move to page start
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description-${experience.id}`}>Description</Label>
          <Textarea
            id={`description-${experience.id}`}
            value={experience.description}
            onChange={(e) =>
              updateExperience(experience.id, { description: e.target.value })
            }
            placeholder="Describe your role and achievements..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Technologies</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {experience.technologies.map((tech, techIndex) => (
              <Badge
                key={techIndex}
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>{tech}</span>
                <button
                  onClick={() => removeTechnology(experience.id, tech)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              placeholder="Add technology..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTechnology(experience.id);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => addTechnology(experience.id)}
              disabled={!newTechnology.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Professional Experience</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No experiences added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {experiences.map((experience, index) =>
            renderExperienceItem(experience, index)
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
