import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { CVSection } from "@/types/cv";

const InterestsForm: React.FC = () => {
  const { cvData, updateCVData } = useCVDataContext();
  const [newInterest, setNewInterest] = useState("");

  // Find the interests section
  const interestsSection = cvData.sections.find(
    (section) => section.type === "interests"
  ) as CVSection;
  const interests: string[] = (interestsSection?.data as string[]) || [];

  const addInterest = () => {
    if (!newInterest.trim()) return;

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "interests") {
        return {
          ...section,
          data: [...interests, newInterest.trim()],
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
    setNewInterest("");
  };

  const removeInterest = (interestToRemove: string) => {
    const updatedInterests = interests.filter(
      (interest) => interest !== interestToRemove
    );

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "interests") {
        return {
          ...section,
          data: updatedInterests,
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
        <h3 className="text-lg font-medium">Interests & Hobbies</h3>
        <p className="text-sm text-gray-600">
          Add your personal interests and hobbies
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Current Interests</Label>
          <div className="flex flex-wrap gap-2">
            {interests.length === 0 ? (
              <p className="text-gray-500 text-sm">No interests added yet.</p>
            ) : (
              interests.map((interest, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{interest}</span>
                  <button
                    onClick={() => removeInterest(interest)}
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
          <Label htmlFor="new-interest">Add New Interest</Label>
          <div className="flex space-x-2">
            <Input
              id="new-interest"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Photography, Hiking, Cooking..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInterest();
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={addInterest}
              disabled={!newInterest.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {interests.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "Photography",
                "Hiking",
                "Cooking",
                "Reading",
                "Traveling",
                "Gaming",
                "Music",
                "Sports",
                "Gardening",
                "Painting",
                "Writing",
                "Dancing",
                "Swimming",
                "Cycling",
                "Yoga",
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!interests.includes(suggestion)) {
                      setNewInterest(suggestion);
                      addInterest();
                    }
                  }}
                  disabled={interests.includes(suggestion)}
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

export default InterestsForm;
