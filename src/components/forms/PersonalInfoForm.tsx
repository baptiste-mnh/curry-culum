import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { useTranslation } from "@/hooks/useTranslation";

export const PersonalInfoForm = () => {
  const { cvData, updatePersonalInfo } = useCVDataContext();
  const { t } = useTranslation();
  const { personalInfo } = cvData;

  const handleChange = (
    field: keyof typeof personalInfo,
    value: string | null
  ) => {
    updatePersonalInfo({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <PhotoUpload
        photoUrl={personalInfo.photoUrl}
        onPhotoChange={(photoUrl) => handleChange("photoUrl", photoUrl)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">{t("form.firstName")}</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder={t("form.firstName")}
          />
        </div>
        <div>
          <Label htmlFor="lastName">{t("form.lastName")}</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder={t("form.lastName")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">{t("form.title")}</Label>
        <Input
          id="title"
          value={personalInfo.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={t("form.title")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">{t("form.email")}</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder={t("form.email")}
          />
        </div>
        <div>
          <Label htmlFor="phone">{t("form.phone")}</Label>
          <Input
            id="phone"
            type="tel"
            value={personalInfo.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder={t("form.phone")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">{t("form.address")}</Label>
        <Input
          id="address"
          value={personalInfo.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder={t("form.address")}
        />
      </div>

      <div>
        <Label htmlFor="summary">{t("form.summary")}</Label>
        <Textarea
          id="summary"
          value={personalInfo.summary || ""}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder={t("form.summary")}
          rows={4}
        />
      </div>
    </div>
  );
};
