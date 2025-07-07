import type { TemplateConfig } from "@/types/app";
import SimpleTemplate from "./SimpleTemplate";
import ModernTemplate from "./ModernTemplate";
import SeleniteTemplate from "./SeleniteTemplate";

export const AVAILABLE_TEMPLATES: TemplateConfig[] = [
  {
    id: "simple",
    name: "Simple",
    description: "A clean and simple CV template",
    component: SimpleTemplate,
    preview: "/templates/simple-preview.png",
  },
  {
    id: "modern",
    name: "Modern",
    description: "A modern and clean CV template",
    component: ModernTemplate,
    preview: "/templates/modern-preview.png",
  },
  {
    id: "selenium",
    name: "Selenium",
    description: "A selenium and clean CV template",
    component: SeleniteTemplate,
    preview: "/templates/selenium-preview.png",
  },
];

export const getTemplateById = (id: string): TemplateConfig | undefined => {
  return AVAILABLE_TEMPLATES.find((template) => template.id === id);
};

export const getTemplateComponent = (id: string) => {
  const template = getTemplateById(id);
  return template?.component || SimpleTemplate;
};

export { SimpleTemplate };
