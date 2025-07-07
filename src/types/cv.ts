export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  summary: string;
  photoUrl: string | null;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Interest {
  id: string;
  name: string;
  role?: string;
  period?: string;
  description?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize?: {
    name: string;
    title: string;
    header: string;
    text: string;
    tags: string;
  };
}

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  data: unknown;
  isAtPageStart: boolean;
  order: number;
}

export type SectionType =
  | "personalInfo"
  | "experiences"
  | "education"
  | "skillCategories"
  | "softSkills"
  | "languages"
  | "projects"
  | "interests"
  | "certifications";

export interface CVData {
  template: string;
  language: "fr" | "en";
  theme: ThemeConfig;
  personalInfo: PersonalInfo;
  sections: CVSection[];
  sectionStartPage: Record<SectionType, boolean>;
  sectionOrder: SectionType[];
  itemPageBreaks: Record<string, boolean>; // Track page breaks by item ID
}

// Specific section data types
export interface ExperienceSection extends CVSection {
  type: "experiences";
  data: Experience[];
}

export interface EducationSection extends CVSection {
  type: "education";
  data: Education[];
}

export interface SkillCategoriesSection extends CVSection {
  type: "skillCategories";
  data: SkillCategory[];
}

export interface SoftSkillsSection extends CVSection {
  type: "softSkills";
  data: string[];
}

export interface LanguagesSection extends CVSection {
  type: "languages";
  data: Language[];
}

export interface ProjectsSection extends CVSection {
  type: "projects";
  data: Project[];
}

export interface InterestsSection extends CVSection {
  type: "interests";
  data: Interest[];
}

export interface CertificationsSection extends CVSection {
  type: "certifications";
  data: Certification[];
}
