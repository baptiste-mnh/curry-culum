import { useState, useEffect, useCallback } from "react";
import type { CVData, SectionType, PersonalInfo } from "@/types/cv";
import {
  createEmptyCVData,
  validateCVData,
  migrateCVData,
  exportCVDataToJSON,
  importCVDataFromJSON,
  ImportResult,
} from "@/utils/cv";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  isLocalStorageAvailable,
} from "@/utils/localStorage";
import { useDebounce } from "./useDebounce";

export interface UseCVDataReturn {
  cvData: CVData;
  isLoading: boolean;
  error: string | null;
  updateCVData: (data: Partial<CVData>) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSectionStartPage: (
    sectionType: SectionType,
    isAtPageStart: boolean
  ) => void;
  updateSectionOrder: (newOrder: SectionType[]) => void;
  updateSectionData: (sectionType: SectionType, data: unknown) => void;
  updateItemPageBreak: (itemId: string, hasPageBreak: boolean) => void;
  createNewCV: (template?: string) => void;
  loadCVData: (jsonString: string) => ImportResult;
  exportCVData: () => string;
  resetCV: () => void;
  resetPageBreaks: () => void;
  setLanguage: (language: "fr" | "en") => void;
  setTemplate: (template: string) => void;
}

export const useCVData = (): UseCVDataReturn => {
  const [cvData, setCVData] = useState<CVData>(() => createEmptyCVData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce the CV data to avoid excessive localStorage writes
  const debouncedCVData = useDebounce(cvData, 200);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        if (!isLocalStorageAvailable()) {
          console.warn("localStorage is not available");
          setIsLoading(false);
          return;
        }

        const savedData = loadFromLocalStorage();
        if (savedData) {
          if (validateCVData(savedData)) {
            const migratedData = migrateCVData(savedData);
            setCVData(migratedData);
          } else {
            console.warn("Invalid saved data, using default");
            setCVData(createEmptyCVData());
          }
        }
      } catch (err) {
        console.error("Error loading CV data:", err);
        setError("Failed to load saved data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to localStorage when data changes (debounced)
  useEffect(() => {
    if (!isLoading && isLocalStorageAvailable()) {
      try {
        saveToLocalStorage(debouncedCVData);
        setError(null);
      } catch (err) {
        console.error("Error saving CV data:", err);
        setError("Failed to save data");
      }
    }
  }, [debouncedCVData, isLoading]);

  const updateCVData = useCallback((data: Partial<CVData>) => {
    setCVData((prev) => ({ ...prev, ...data }));
  }, []);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  }, []);

  const updateSectionStartPage = useCallback(
    (sectionType: SectionType, isSectionStartPage: boolean) => {
      setCVData((prev) => ({
        ...prev,
        sectionStartPage: {
          ...prev.sectionStartPage,
          [sectionType]: isSectionStartPage,
        },
      }));
    },
    []
  );

  const updateSectionOrder = useCallback((newOrder: SectionType[]) => {
    setCVData((prev) => ({
      ...prev,
      sectionOrder: newOrder,
    }));
  }, []);

  const updateSectionData = useCallback(
    (sectionType: SectionType, data: unknown) => {
      setCVData((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.type === sectionType ? { ...section, data } : section
        ),
      }));
    },
    []
  );

  const updateItemPageBreak = useCallback(
    (itemId: string, hasPageBreak: boolean) => {
      setCVData((prev) => ({
        ...prev,
        itemPageBreaks: {
          ...prev.itemPageBreaks,
          [itemId]: hasPageBreak,
        },
      }));
    },
    []
  );

  const createNewCV = useCallback((template: string = "base") => {
    const newCVData = createEmptyCVData(template);
    setCVData(newCVData);
    setError(null);
  }, []);

  const loadCVData = useCallback((jsonString: string): ImportResult => {
    const result = importCVDataFromJSON(jsonString);

    if (result.success && result.data) {
      setCVData(result.data);
      setError(null);
    }
    return result;
  }, []);

  const exportCVData = useCallback(() => {
    return exportCVDataToJSON(cvData);
  }, [cvData]);

  const resetCV = useCallback(() => {
    try {
      clearLocalStorage();
      setCVData(createEmptyCVData());
      setError(null);
    } catch (err) {
      console.error("Error resetting CV:", err);
      setError("Failed to reset CV");
    }
  }, []);

  const resetPageBreaks = useCallback(() => {
    try {
      const emptyCVData = createEmptyCVData();
      setCVData((prev) => ({
        ...prev,
        sectionStartPage: emptyCVData.sectionStartPage,
        itemPageBreaks: {},
      }));
      setError(null);
    } catch (err) {
      console.error("Error resetting page breaks:", err);
      setError("Failed to reset page breaks");
    }
  }, []);

  const setLanguage = useCallback((language: "fr" | "en") => {
    setCVData((prev) => ({ ...prev, language }));
  }, []);

  const setTemplate = useCallback((template: string) => {
    setCVData((prev) => ({ ...prev, template }));
  }, []);

  return {
    cvData,
    isLoading,
    error,
    updateCVData,
    updatePersonalInfo,
    updateSectionStartPage,
    updateSectionOrder,
    updateSectionData,
    updateItemPageBreak,
    createNewCV,
    loadCVData,
    exportCVData,
    resetCV,
    resetPageBreaks,
    setLanguage,
    setTemplate,
  };
};
