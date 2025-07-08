import type { CVData, PersonalInfo, CVSection, SectionType } from "@/types/cv";
import {
  DEFAULT_THEME,
  DEFAULT_SECTION_ORDER,
  SECTIONS_CONFIG,
} from "@/constants/sections";

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createEmptyPersonalInfo = (): PersonalInfo => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  title: "",
  summary: "",
  photoUrl: null,
});

export const createEmptySection = (type: SectionType): CVSection => {
  const config = SECTIONS_CONFIG.find((s) => s.id === type);
  return {
    id: generateId(),
    type,
    title: config?.titleKey.en || type,
    data: [],
    isAtPageStart: config?.defaultStartPage ?? false,
    order: config?.order || 0,
  };
};

export const createEmptyCVData = (template: string = "base"): CVData => {
  const sections: CVSection[] = DEFAULT_SECTION_ORDER.map((type) =>
    createEmptySection(type)
  );

  const sectionStartPage = DEFAULT_SECTION_ORDER.reduce((acc, type) => {
    const config = SECTIONS_CONFIG.find((s) => s.id === type);
    acc[type] = config?.defaultStartPage ?? false;
    return acc;
  }, {} as Record<SectionType, boolean>);

  return {
    template,
    language: "en",
    theme: { ...DEFAULT_THEME },
    personalInfo: createEmptyPersonalInfo(),
    sections,
    sectionStartPage,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    itemPageBreaks: {}, // Initialize empty page breaks tracking
  };
};

export const validateCVData = (data: unknown): data is CVData => {
  if (!data || typeof data !== "object") {
    return false;
  }

  const cvData = data as CVData;

  // Basic structure validation
  if (!cvData.template || typeof cvData.template !== "string") {
    return false;
  }

  if (!cvData.language || !["fr", "en"].includes(cvData.language)) {
    return false;
  }

  if (!cvData.theme || typeof cvData.theme !== "object") {
    return false;
  }

  if (!cvData.personalInfo || typeof cvData.personalInfo !== "object") {
    return false;
  }

  if (!Array.isArray(cvData.sections)) {
    return false;
  }

  if (!cvData.sectionStartPage || typeof cvData.sectionStartPage !== "object") {
    return false;
  }

  if (!Array.isArray(cvData.sectionOrder)) {
    return false;
  }

  return true;
};

export const migrateCVData = (data: CVData): CVData => {
  // Ensure all required sections exist
  const existingSectionTypes = data.sections.map((s) => s.type);
  const missingSectionTypes = DEFAULT_SECTION_ORDER.filter(
    (type) => !existingSectionTypes.includes(type)
  );

  const newSections = missingSectionTypes.map((type) =>
    createEmptySection(type)
  );

  // Update section visibility for new sections
  const updatedSectionStartPage = { ...data.sectionStartPage };
  missingSectionTypes.forEach((type) => {
    const config = SECTIONS_CONFIG.find((s) => s.id === type);
    updatedSectionStartPage[type] = config?.defaultStartPage || true;
  });

  return {
    ...data,
    sections: [...data.sections, ...newSections],
    sectionStartPage: updatedSectionStartPage,
    sectionOrder:
      data.sectionOrder.length > 0 ? data.sectionOrder : DEFAULT_SECTION_ORDER,
    itemPageBreaks: data.itemPageBreaks || {}, // Initialize if missing
  };
};

export const exportCVDataToJSON = (data: CVData): string => {
  return JSON.stringify(data, null, 2);
};

export interface ImportResult {
  success: boolean;
  data?: CVData;
  error?: string;
}

export const importCVDataFromJSON = (jsonString: string): ImportResult => {
  try {
    // Check if the string is empty or just whitespace
    if (!jsonString || jsonString.trim() === "") {
      return {
        success: false,
        error: "The file is empty or contains no valid data",
      };
    }

    const parsedData = JSON.parse(jsonString);

    if (!validateCVData(parsedData)) {
      return {
        success: false,
        error:
          "The CV data format is not valid. Please check that the file contains compatible CV data.",
      };
    }

    const migratedData = migrateCVData(parsedData);
    return {
      success: true,
      data: migratedData,
    };
  } catch (error) {
    console.error("Error importing CV data:", error);

    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: "The JSON file is not valid. Please check the file syntax.",
      };
    }

    return {
      success: false,
      error: "Error importing CV data. Please check the file.",
    };
  }
};
