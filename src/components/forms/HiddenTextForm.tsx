import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import type { HiddenTextSection } from "@/types/cv";

interface HiddenTextFormProps {
  section: HiddenTextSection;
  onUpdate: (section: HiddenTextSection) => void;
}

export const HiddenTextForm: React.FC<HiddenTextFormProps> = ({
  section,
  onUpdate,
}) => {
  const { t } = useTranslation();

  const handleTextChange = (text: string) => {
    onUpdate({
      ...section,
      data: text,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">👁️‍🗨️</span>
          {t("hiddenText.text")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hidden-text">{t("hiddenText.text")}</Label>
          <Textarea
            id="hidden-text"
            value={section.data}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t("hiddenText.placeholder")}
            className="min-h-[120px]"
          />
          <p className="text-sm text-muted-foreground">
            {t("hiddenText.placeholder")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
