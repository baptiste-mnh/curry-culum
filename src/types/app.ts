import type { CVData, SectionType } from "./cv";

export interface TemplateProps {
  cvData: CVData;
  className?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<TemplateProps>;
  preview?: string;
}

export interface SectionConfig {
  id: SectionType;
  name: string;
  icon: string;
  defaultStartPage: boolean;
  order: number;
  titleKey: {
    fr: string;
    en: string;
  };
}

export interface Translation {
  [key: string]: {
    fr: string;
    en: string;
  };
}

export interface FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "textarea" | "date";
}

export interface DragDropItem {
  id: string;
  type: string;
  index: number;
}
