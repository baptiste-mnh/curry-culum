import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { Education, CVSection } from "@/types/cv";
import { generateId } from "@/utils/cv";

const EducationForm: React.FC = () => {
  const { cvData, updateCVData, updateItemPageBreak } = useCVDataContext();

  // Find the education section
  const educationSection = cvData.sections.find(
    (section) => section.type === "education"
  ) as CVSection;
  const education: Education[] = (educationSection?.data as Education[]) || [];

  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: "",
    };

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "education") {
        return {
          ...section,
          data: [...education, newEducation],
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    const updatedEducation = education.map((edu) =>
      edu.id === id ? { ...edu, ...updates } : edu
    );

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "education") {
        return {
          ...section,
          data: updatedEducation,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const removeEducation = (id: string) => {
    const updatedEducation = education.filter((edu) => edu.id !== id);

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "education") {
        return {
          ...section,
          data: updatedEducation,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const moveEducation = (id: string, direction: "up" | "down") => {
    const currentIndex = education.findIndex((edu) => edu.id === id);
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === "up" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === "down" && currentIndex < education.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return; // Can't move further
    }

    const newEducation = [...education];
    [newEducation[currentIndex], newEducation[newIndex]] = [
      newEducation[newIndex],
      newEducation[currentIndex],
    ];

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "education") {
        return {
          ...section,
          data: newEducation,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const renderEducationItem = (edu: Education, index: number) => (
    <Card key={edu.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Education {index + 1}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveEducation(edu.id, "up")}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveEducation(edu.id, "down")}
                disabled={index === education.length - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeEducation(edu.id)}
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
            <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
            <Input
              id={`degree-${edu.id}`}
              value={edu.degree}
              onChange={(e) =>
                updateEducation(edu.id, { degree: e.target.value })
              }
              placeholder="Bachelor of Science"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
            <Input
              id={`institution-${edu.id}`}
              value={edu.institution}
              onChange={(e) =>
                updateEducation(edu.id, { institution: e.target.value })
              }
              placeholder="University Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
            <Input
              id={`startDate-${edu.id}`}
              type="month"
              value={edu.startDate}
              onChange={(e) =>
                updateEducation(edu.id, { startDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
            <Input
              id={`endDate-${edu.id}`}
              type="month"
              value={edu.endDate}
              onChange={(e) =>
                updateEducation(edu.id, { endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`grade-${edu.id}`}>Grade</Label>
          <Input
            id={`grade-${edu.id}`}
            value={edu.grade}
            onChange={(e) => updateEducation(edu.id, { grade: e.target.value })}
            placeholder="3.8 GPA, First Class Honours"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description-${edu.id}`}>Description</Label>
          <Textarea
            id={`description-${edu.id}`}
            value={edu.description}
            onChange={(e) =>
              updateEducation(edu.id, { description: e.target.value })
            }
            placeholder="Describe your studies, achievements, relevant coursework..."
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`pageBreak-${edu.id}`}
            checked={cvData.itemPageBreaks[edu.id] || false}
            onCheckedChange={(checked) => {
              updateItemPageBreak(edu.id, checked);
            }}
          />
          <Label htmlFor={`pageBreak-${edu.id}`}>Move to page start</Label>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Education</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No education entries added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {education.map((edu, index) => renderEducationItem(edu, index))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
