import type { SectionConfig, Translation } from "@/types/app";
import type { ThemeConfig, SectionType } from "@/types/cv";

export const SECTIONS_CONFIG: SectionConfig[] = [
  {
    id: "personalInfo",
    name: "Personal Information",
    icon: "User",
    defaultStartPage: false,
    order: 0,
    titleKey: {
      fr: "Informations personnelles",
      en: "Personal Information",
    },
  },
  {
    id: "experiences",
    name: "Professional Experience",
    icon: "Briefcase",
    defaultStartPage: false,
    order: 1,
    titleKey: {
      fr: "Expérience professionnelle",
      en: "Professional Experience",
    },
  },
  {
    id: "education",
    name: "Education",
    icon: "GraduationCap",
    defaultStartPage: false,
    order: 2,
    titleKey: {
      fr: "Formation",
      en: "Education",
    },
  },
  {
    id: "skillCategories",
    name: "Technical Skills",
    icon: "Code",
    defaultStartPage: false,
    order: 3,
    titleKey: {
      fr: "Compétences techniques",
      en: "Technical Skills",
    },
  },
  {
    id: "softSkills",
    name: "Soft Skills",
    icon: "Heart",
    defaultStartPage: false,
    order: 4,
    titleKey: {
      fr: "Soft Skills",
      en: "Soft Skills",
    },
  },
  {
    id: "languages",
    name: "Languages",
    icon: "Globe",
    defaultStartPage: false,
    order: 5,
    titleKey: {
      fr: "Langues",
      en: "Languages",
    },
  },
  {
    id: "projects",
    name: "Projects",
    icon: "FolderOpen",
    defaultStartPage: false,
    order: 6,
    titleKey: {
      fr: "Projets",
      en: "Projects",
    },
  },
  {
    id: "interests",
    name: "Interests",
    icon: "Star",
    defaultStartPage: false,
    order: 7,
    titleKey: {
      fr: "Centres d'intérêt",
      en: "Interests",
    },
  },
  {
    id: "certifications",
    name: "Certifications",
    icon: "Award",
    defaultStartPage: false,
    order: 8,
    titleKey: {
      fr: "Certifications",
      en: "Certifications",
    },
  },
  {
    id: "hiddenText",
    name: "Hidden Text",
    icon: "EyeOff",
    defaultStartPage: false,
    order: 9,
    titleKey: {
      fr: "Texte caché",
      en: "Hidden Text",
    },
  },
];

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: "#1f2937",
  secondaryColor: "#6b7280",
  accentColor: "#3b82f6",
  fontFamily: "Helvetica",
  fontSize: {
    name: "24px",
    title: "16px",
    header: "14px",
    text: "12px",
    tags: "10px",
  },
};

export const AVAILABLE_FONTS = ["Helvetica", "Roboto", "Arial"];

export const DEFAULT_SECTION_ORDER: SectionType[] = [
  "personalInfo",
  "experiences",
  "education",
  "skillCategories",
  "softSkills",
  "languages",
  "projects",
  "interests",
  "certifications",
  "hiddenText",
];

export const TRANSLATIONS: Translation = {
  // Navigation
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.editor": { fr: "Éditeur", en: "Editor" },

  // Buttons
  "button.save": { fr: "Sauvegarder", en: "Save" },
  "button.export": { fr: "Exporter", en: "Export" },
  "button.reset": { fr: "Réinitialiser", en: "Reset" },
  "button.add": { fr: "Ajouter", en: "Add" },
  "button.delete": { fr: "Supprimer", en: "Delete" },
  "button.edit": { fr: "Modifier", en: "Edit" },
  "button.cancel": { fr: "Annuler", en: "Cancel" },
  "button.confirm": { fr: "Confirmer", en: "Confirm" },

  // Forms
  "form.firstName": { fr: "Prénom", en: "First Name" },
  "form.lastName": { fr: "Nom", en: "Last Name" },
  "form.email": { fr: "Email", en: "Email" },
  "form.phone": { fr: "Téléphone", en: "Phone" },
  "form.address": { fr: "Adresse", en: "Address" },
  "form.title": { fr: "Titre professionnel", en: "Professional Title" },
  "form.summary": { fr: "Résumé", en: "Summary" },

  // Experience
  "experience.position": { fr: "Poste", en: "Position" },
  "experience.company": { fr: "Entreprise", en: "Company" },
  "experience.startDate": { fr: "Date de début", en: "Start Date" },
  "experience.endDate": { fr: "Date de fin", en: "End Date" },
  "experience.current": { fr: "Poste actuel", en: "Current Position" },
  "experience.description": { fr: "Description", en: "Description" },
  "experience.technologies": { fr: "Technologies", en: "Technologies" },

  // Education
  "education.degree": { fr: "Diplôme", en: "Degree" },
  "education.institution": { fr: "Établissement", en: "Institution" },
  "education.grade": { fr: "Mention", en: "Grade" },

  // Skills
  "skills.category": { fr: "Catégorie", en: "Category" },
  "skills.skills": { fr: "Compétences", en: "Skills" },

  // Languages
  "language.name": { fr: "Langue", en: "Language" },
  "language.level": { fr: "Niveau", en: "Level" },

  // Projects
  "project.title": { fr: "Titre", en: "Title" },
  "project.description": { fr: "Description", en: "Description" },
  "project.url": { fr: "URL", en: "URL" },
  "project.github": { fr: "GitHub", en: "GitHub" },

  // Certifications
  "certification.name": { fr: "Nom", en: "Name" },
  "certification.issuer": { fr: "Organisme", en: "Issuer" },
  "certification.date": { fr: "Date", en: "Date" },
  "certification.url": { fr: "URL", en: "URL" },

  // Hidden Text
  "hiddenText.text": { fr: "Texte caché", en: "Hidden Text" },
  "hiddenText.placeholder": {
    fr: "Entrez le texte qui sera invisible mais lisible par les outils d'IA...",
    en: "Enter text that will be invisible but readable by AI tools...",
  },

  // Messages
  "message.saved": { fr: "Sauvegardé avec succès", en: "Saved successfully" },
  "message.error": { fr: "Une erreur est survenue", en: "An error occurred" },
  "message.confirm.reset": {
    fr: "Êtes-vous sûr de vouloir réinitialiser ?",
    en: "Are you sure you want to reset?",
  },
  "message.confirm.delete": {
    fr: "Êtes-vous sûr de vouloir supprimer ?",
    en: "Are you sure you want to delete?",
  },
};
