import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2 } from "lucide-react";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { CVSection, Interest } from "@/types/cv";

const InterestsForm: React.FC = () => {
  const { cvData, updateCVData } = useCVDataContext();
  const [newInterest, setNewInterest] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingInterest, setEditingInterest] = useState<string | null>(null);

  // Find the interests section
  const interestsSection = cvData.sections.find(
    (section) => section.type === "interests"
  ) as CVSection;
  const interests: Interest[] = (interestsSection?.data as Interest[]) || [];

  const addInterest = () => {
    if (!newInterest.trim()) return;

    const newInterestObj: Interest = {
      id: `interest-${Date.now()}`,
      name: newInterest.trim(),
      description: newDescription.trim() || undefined,
    };

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "interests") {
        return {
          ...section,
          data: [...interests, newInterestObj],
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
    setNewInterest("");
    setNewDescription("");
  };

  const removeInterest = (interestId: string) => {
    const updatedInterests = interests.filter(
      (interest) => interest.id !== interestId
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

  const updateInterest = (
    interestId: string,
    name: string,
    description: string
  ) => {
    const updatedInterests = interests.map((interest) => {
      if (interest.id === interestId) {
        return {
          ...interest,
          name: name.trim(),
          description: description.trim() || undefined,
        };
      }
      return interest;
    });

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
    setEditingInterest(null);
  };

  const startEditing = (interest: Interest) => {
    setNewInterest(interest.name);
    setNewDescription(interest.description || "");
    setEditingInterest(interest.id);
  };

  const cancelEditing = () => {
    setNewInterest("");
    setNewDescription("");
    setEditingInterest(null);
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
          {interests.length === 0 ? (
            <p className="text-gray-500 text-sm">No interests added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interests.map((interest) => (
                <Card key={interest.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{interest.name}</h4>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(interest)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInterest(interest.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {interest.description && (
                    <p className="text-xs text-gray-600">
                      {interest.description}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-interest">
            {editingInterest ? "Edit Interest" : "Add New Interest"}
          </Label>
          <div className="space-y-2">
            <Input
              id="new-interest"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Photography, Hiking, Cooking..."
            />
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description of this interest..."
              rows={2}
            />
            <div className="flex space-x-2">
              <Button
                type="button"
                size="sm"
                onClick={
                  editingInterest
                    ? () =>
                        updateInterest(
                          editingInterest,
                          newInterest,
                          newDescription
                        )
                    : addInterest
                }
                disabled={!newInterest.trim()}
              >
                {editingInterest ? "Update" : "Add"}
              </Button>
              {editingInterest && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={cancelEditing}
                >
                  Cancel
                </Button>
              )}
            </div>
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
                    if (
                      !interests.some(
                        (interest) => interest.name === suggestion
                      )
                    ) {
                      setNewInterest(suggestion);
                      setNewDescription("");
                    }
                  }}
                  disabled={interests.some(
                    (interest) => interest.name === suggestion
                  )}
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
