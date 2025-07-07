import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { CVSection } from "@/types/cv";

const SoftSkillsForm: React.FC = () => {
  const { cvData, updateCVData } = useCVDataContext();
  const [newSkill, setNewSkill] = useState("");

  // Find the soft skills section
  const softSkillsSection = cvData.sections.find(
    (section) => section.type === "softSkills"
  ) as CVSection;
  const softSkills: string[] = (softSkillsSection?.data as string[]) || [];

  const addSoftSkill = () => {
    if (!newSkill.trim()) return;

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "softSkills") {
        return {
          ...section,
          data: [...softSkills, newSkill.trim()],
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
    setNewSkill("");
  };

  const removeSoftSkill = (skillToRemove: string) => {
    const updatedSkills = softSkills.filter((skill) => skill !== skillToRemove);

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "softSkills") {
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Soft Skills</h3>
        <p className="text-sm text-gray-600">
          Add your interpersonal and communication skills
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Current Soft Skills</Label>
          <div className="flex flex-wrap gap-2">
            {softSkills.length === 0 ? (
              <p className="text-gray-500 text-sm">No soft skills added yet.</p>
            ) : (
              softSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSoftSkill(skill)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-soft-skill">Add New Soft Skill</Label>
          <div className="flex space-x-2">
            <Input
              id="new-soft-skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Leadership, Communication, Teamwork..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSoftSkill();
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={addSoftSkill}
              disabled={!newSkill.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {softSkills.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Common Soft Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "Leadership",
                "Communication",
                "Teamwork",
                "Problem Solving",
                "Time Management",
                "Adaptability",
                "Creativity",
                "Critical Thinking",
                "Emotional Intelligence",
                "Negotiation",
                "Conflict Resolution",
                "Public Speaking",
                "Active Listening",
                "Empathy",
                "Collaboration",
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!softSkills.includes(suggestion)) {
                      setNewSkill(suggestion);
                      addSoftSkill();
                    }
                  }}
                  disabled={softSkills.includes(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SoftSkillsForm;
