import type { CVData } from "@/types/cv";

const STORAGE_KEY = "cv-builder-data";

export const saveToLocalStorage = (data: CVData): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw new Error("Failed to save data to localStorage");
  }
};

export const loadFromLocalStorage = (): CVData | null => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as CVData;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    throw new Error("Failed to clear localStorage");
  }
};

export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
