import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { Certification, CVSection } from "@/types/cv";
import { generateId } from "@/utils/cv";

const CertificationsForm: React.FC = () => {
  const { cvData, updateCVData, updateItemPageBreak } = useCVDataContext();

  // Find the certifications section
  const certificationsSection = cvData.sections.find(
    (section) => section.type === "certifications"
  ) as CVSection;
  const certifications: Certification[] =
    (certificationsSection?.data as Certification[]) || [];

  const addCertification = () => {
    const newCertification: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
      url: "",
    };

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "certifications") {
        return {
          ...section,
          data: [...certifications, newCertification],
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    const updatedCertifications = certifications.map((cert) =>
      cert.id === id ? { ...cert, ...updates } : cert
    );

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "certifications") {
        return {
          ...section,
          data: updatedCertifications,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const removeCertification = (id: string) => {
    const updatedCertifications = certifications.filter(
      (cert) => cert.id !== id
    );

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "certifications") {
        return {
          ...section,
          data: updatedCertifications,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const moveCertification = (id: string, direction: "up" | "down") => {
    const currentIndex = certifications.findIndex((cert) => cert.id === id);
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === "up" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (
      direction === "down" &&
      currentIndex < certifications.length - 1
    ) {
      newIndex = currentIndex + 1;
    } else {
      return; // Can't move further
    }

    const newCertifications = [...certifications];
    [newCertifications[currentIndex], newCertifications[newIndex]] = [
      newCertifications[newIndex],
      newCertifications[currentIndex],
    ];

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "certifications") {
        return {
          ...section,
          data: newCertifications,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const renderCertificationItem = (
    certification: Certification,
    index: number
  ) => (
    <Card key={certification.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Certification {index + 1}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveCertification(certification.id, "up")}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveCertification(certification.id, "down")}
                disabled={index === certifications.length - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeCertification(certification.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`certification-name-${certification.id}`}>
            Certification Name
          </Label>
          <Input
            id={`certification-name-${certification.id}`}
            value={certification.name}
            onChange={(e) =>
              updateCertification(certification.id, { name: e.target.value })
            }
            placeholder="AWS Certified Solutions Architect"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`certification-issuer-${certification.id}`}>
            Issuing Organization
          </Label>
          <Input
            id={`certification-issuer-${certification.id}`}
            value={certification.issuer}
            onChange={(e) =>
              updateCertification(certification.id, { issuer: e.target.value })
            }
            placeholder="Amazon Web Services"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`certification-date-${certification.id}`}>
              Date Obtained
            </Label>
            <Input
              id={`certification-date-${certification.id}`}
              type="month"
              value={certification.date}
              onChange={(e) =>
                updateCertification(certification.id, { date: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`certification-url-${certification.id}`}>
              Verification URL
            </Label>
            <Input
              id={`certification-url-${certification.id}`}
              value={certification.url || ""}
              onChange={(e) =>
                updateCertification(certification.id, { url: e.target.value })
              }
              placeholder="https://verify.credly.com/..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`pageBreak-${certification.id}`}
            checked={cvData.itemPageBreaks[certification.id] || false}
            onCheckedChange={(checked) => {
              updateItemPageBreak(certification.id, checked);
            }}
          />
          <Label htmlFor={`pageBreak-${certification.id}`}>
            Move to page start
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Certifications</h3>
        <Button onClick={addCertification} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No certifications added yet.</p>
          <p className="text-sm">Click "Add Certification" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {certifications.map((certification, index) =>
            renderCertificationItem(certification, index)
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationsForm;
