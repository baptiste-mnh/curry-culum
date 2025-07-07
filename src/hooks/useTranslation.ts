import { useCVData } from "@/hooks/useCVData";
import { TRANSLATIONS } from "@/constants/sections";

export const useTranslation = () => {
  const { cvData } = useCVData();
  const language = cvData.language;

  const t = (key: string | { fr: string; en: string }): string => {
    if (typeof key === "string") {
      return TRANSLATIONS[key]?.[language] || key;
    } else {
      return key[language] || key.en || "";
    }
  };

  return { t, language };
};
