import { SECTIONS_CONFIG } from "@/constants/sections";
import type { TemplateProps } from "@/types/app";
import {
  Certification,
  Education,
  Experience,
  Language,
  Project,
  SectionType,
  SkillCategory,
  ThemeConfig,
} from "@/types/cv";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import React from "react";

const ModernTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const { personalInfo, sections, language, theme } = cvData;

  // Helper function to safely get font sizes
  const getFontSize = (
    type: keyof NonNullable<ThemeConfig["fontSize"]>,
    defaultSize: string
  ) => {
    const fontSize = theme?.fontSize?.[type];
    if (fontSize) {
      return parseInt(fontSize);
    }
    return parseInt(defaultSize);
  };

  // Color scheme
  const colors = {
    primary: theme?.primaryColor || "#2563eb",
    secondary: theme?.secondaryColor || "#64748b",
    accent: theme?.accentColor || "#3b82f6",
    text: "#1e293b",
    lightText: "#64748b",
    background: "#e4e4e4",
    white: "#ffffff",
    border: "#e2e8f0",
  };

  // Styles
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: 10,
      flexDirection: "row",
      marginVertical: 20,
    },
    // Left column styles
    leftColumn: {
      width: "35%",
      padding: 20,
      marginVertical: -20,
      borderRight: `1px solid ${colors.border}`,
    },
    // Right column styles
    rightColumn: {
      width: "65%",
      padding: 20,
    },
    // Header styles (left column)
    profileSection: {
      marginBottom: 25,
      textAlign: "center",
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      marginBottom: 15,
      alignSelf: "center",
      objectFit: "cover",
    },
    name: {
      fontSize: getFontSize("name", "24px"),
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 5,
      textAlign: "center",
    },
    title: {
      fontSize: getFontSize("title", "16px"),
      color: colors.secondary,
      marginBottom: 15,
      textAlign: "center",
      fontWeight: "bold",
    },
    contactInfo: {
      marginBottom: 20,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      fontSize: 9,
    },
    contactIcon: {
      width: 12,
      height: 12,
      marginRight: 8,
      backgroundColor: colors.primary,
      borderRadius: 6,
    },
    contactText: {
      color: colors.text,
      fontSize: 9,
    },
    // Section styles
    sectionTitle: {
      fontSize: getFontSize("header", "14px"),
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 12,
      paddingBottom: 5,
      borderBottom: `2px solid ${colors.accent}`,
      textTransform: "uppercase",
    },
    leftSectionTitle: {
      fontSize: getFontSize("header", "14px"),
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 10,
      marginTop: 20,
      textTransform: "uppercase",
    },
    section: {
      marginBottom: 20,
    },
    leftSection: {
      marginBottom: 20,
    },
    // Experience styles (right column)
    experienceItem: {
      marginBottom: 20,
      paddingBottom: 15,
      borderBottom: `1px solid ${colors.border}`,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 5,
    },
    experienceTitle: {
      fontSize: getFontSize("header", "14px"),
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 2,
    },
    experienceCompany: {
      fontSize: 11,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 3,
    },
    experienceDate: {
      fontSize: 9,
      color: colors.lightText,
      fontStyle: "italic",
    },
    experienceDescription: {
      fontSize: getFontSize("text", "12px"),
      color: colors.text,
      lineHeight: 1.4,
      marginBottom: 8,
    },
    experienceTech: {
      fontSize: 9,
      color: colors.lightText,
      fontStyle: "italic",
    },
    // Education styles (right column)
    educationItem: {
      marginBottom: 15,
      paddingBottom: 10,
      borderBottom: `1px solid ${colors.border}`,
    },
    educationDegree: {
      fontSize: 11,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 2,
    },
    educationInstitution: {
      fontSize: 10,
      color: colors.primary,
      marginBottom: 2,
    },
    educationDate: {
      fontSize: 9,
      color: colors.lightText,
      marginBottom: 3,
    },
    educationGrade: {
      fontSize: 9,
      color: colors.text,
    },
    // Skills styles (left column)
    skillCategory: {
      marginBottom: 15,
    },
    skillCategoryTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    skillItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },
    skillName: {
      fontSize: 9,
      color: colors.text,
      flex: 1,
    },
    skillLevel: {
      flexDirection: "row",
      alignItems: "center",
    },
    skillDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 2,
    },
    skillDotFilled: {
      backgroundColor: colors.primary,
    },
    skillDotEmpty: {
      backgroundColor: colors.border,
    },
    // Tags styles
    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 5,
    },
    tag: {
      backgroundColor: colors.primary,
      color: colors.white,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      fontSize: getFontSize("tags", "10px"),
      fontWeight: "bold",
    },
    // Language styles (left column)
    languageItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    languageName: {
      fontSize: 9,
      color: colors.text,
    },
    languageLevel: {
      fontSize: 8,
      color: colors.lightText,
      fontStyle: "italic",
    },
    // Projects styles (right column)
    projectItem: {
      marginBottom: 15,
      paddingBottom: 10,
      borderBottom: `1px solid ${colors.border}`,
    },
    projectTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 5,
    },
    projectDescription: {
      fontSize: 10,
      color: colors.text,
      lineHeight: 1.4,
      marginBottom: 5,
    },
    projectTech: {
      fontSize: 9,
      color: colors.lightText,
      marginBottom: 3,
    },
    projectLinks: {
      fontSize: 9,
      color: colors.primary,
    },
    // Summary styles (left column)
    summary: {
      fontSize: 9,
      color: colors.text,
      lineHeight: 1.4,
      textAlign: "justify",
    },
  });

  // Helper functions
  const getSectionData = <T,>(type: SectionType): T | undefined => {
    const section = sections.find((s) => s.type === type);
    return section?.data as T;
  };

  const getSafeArrayData = <T,>(type: SectionType): T[] => {
    const data = getSectionData<T[]>(type);
    return Array.isArray(data) ? data : [];
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isVisible = (_: SectionType) => true;

  const getTranslatedTitle = (type: SectionType) => {
    const config = SECTIONS_CONFIG.find((s) => s.id === type);
    return config?.titleKey?.[language] || type;
  };

  const safeRender = (
    value: string | number | object | null | undefined
  ): string => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  // Data extraction
  const experiences = getSafeArrayData<Experience>("experiences");
  const educationList = getSafeArrayData<Education>("education");
  const skillCategories = getSafeArrayData<SkillCategory>("skillCategories");
  const languages = getSafeArrayData<Language>("languages");
  const projects = getSafeArrayData<Project>("projects");
  const certifications = getSafeArrayData<Certification>("certifications");
  const interests = getSafeArrayData<string>("interests");

  // Render skill level dots
  const renderSkillLevel = () => {
    // Simple logic: 4 dots for demonstration
    const totalDots = 4;
    const filledDots = Math.floor(Math.random() * 4) + 1; // Random for demo

    return (
      <View style={styles.skillLevel}>
        {Array.from({ length: totalDots }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.skillDot,
              index < filledDots ? styles.skillDotFilled : styles.skillDotEmpty,
            ]}
          />
        ))}
      </View>
    );
  };

  // Left column render functions
  const renderProfile = () => (
    <View style={styles.profileSection}>
      {personalInfo?.photoUrl ? (
        <Image src={personalInfo.photoUrl} style={styles.profileImage} />
      ) : (
        <View style={styles.profileImage} />
      )}
      <Text style={styles.name}>
        {safeRender(personalInfo?.firstName)}{" "}
        {safeRender(personalInfo?.lastName)}
      </Text>
      {personalInfo?.title && (
        <Text style={styles.title}>{safeRender(personalInfo.title)}</Text>
      )}
    </View>
  );

  const renderContact = () => (
    <View style={styles.contactInfo}>
      <Text style={styles.leftSectionTitle}>Contact</Text>
      {personalInfo?.email && (
        <View style={styles.contactItem}>
          <View style={styles.contactIcon} />
          <Text style={styles.contactText}>
            {safeRender(personalInfo.email)}
          </Text>
        </View>
      )}
      {personalInfo?.phone && (
        <View style={styles.contactItem}>
          <View style={styles.contactIcon} />
          <Text style={styles.contactText}>
            {safeRender(personalInfo.phone)}
          </Text>
        </View>
      )}
      {personalInfo?.address && (
        <View style={styles.contactItem}>
          <View style={styles.contactIcon} />
          <Text style={styles.contactText}>
            {safeRender(personalInfo.address)}
          </Text>
        </View>
      )}
    </View>
  );

  const renderSummary = () => {
    if (!personalInfo?.summary) return null;

    return (
      <View style={styles.leftSection}>
        <Text style={styles.leftSectionTitle}>
          {language === "fr" ? "Profil" : "Profile"}
        </Text>
        <Text style={styles.summary}>{safeRender(personalInfo.summary)}</Text>
      </View>
    );
  };

  const renderLeftSkills = () => {
    if (!isVisible("skillCategories") || skillCategories.length === 0)
      return null;

    return (
      <View
        style={styles.leftSection}
        break={cvData.sectionStartPage["skillCategories"] || false}
      >
        <Text style={styles.leftSectionTitle}>
          {getTranslatedTitle("skillCategories")}
        </Text>
        {skillCategories.map((cat, index) => (
          <View
            key={cat?.id || index}
            style={styles.skillCategory}
            break={
              index === 0
                ? false
                : cvData.itemPageBreaks[cat?.id || ""] || false
            }
            wrap={false}
          >
            <Text style={styles.skillCategoryTitle}>
              {safeRender(cat?.name)}
            </Text>
            {cat?.skills &&
              Array.isArray(cat.skills) &&
              cat.skills.slice(0, 5).map((skill, idx) => (
                <View key={idx} style={styles.skillItem} minPresenceAhead={30}>
                  <Text style={styles.skillName}>{safeRender(skill)}</Text>
                  {renderSkillLevel()}
                </View>
              ))}
          </View>
        ))}
      </View>
    );
  };

  const renderLeftLanguages = () => {
    if (!isVisible("languages") || languages.length === 0) return null;

    return (
      <View
        style={styles.leftSection}
        break={cvData.sectionStartPage["languages"] || false}
        wrap={false}
      >
        <Text style={styles.leftSectionTitle}>
          {getTranslatedTitle("languages")}
        </Text>
        {languages.map((lang, index) => (
          <View key={lang?.id || index} style={styles.languageItem}>
            <Text style={styles.languageName}>{safeRender(lang?.name)}</Text>
            <Text style={styles.languageLevel}>{safeRender(lang?.level)}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderLeftInterests = () => {
    if (!isVisible("interests") || interests.length === 0) return null;

    return (
      <View
        style={styles.leftSection}
        break={cvData.sectionStartPage["interests"] || false}
        wrap={false}
      >
        <Text style={styles.leftSectionTitle}>
          {getTranslatedTitle("interests")}
        </Text>
        <View style={styles.tagContainer}>
          {interests.slice(0, 8).map((interest, idx) => (
            <Text key={idx} style={styles.tag}>
              {safeRender(interest)}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  // Right column render functions
  const renderExperiences = () => {
    if (!isVisible("experiences") || experiences.length === 0) return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["experiences"] || false}
      >
        <Text style={styles.sectionTitle}>
          {getTranslatedTitle("experiences")}
        </Text>
        {experiences.map((exp, index) => (
          <View
            key={exp?.id || index}
            style={styles.experienceItem}
            break={
              index === 0
                ? false
                : cvData.itemPageBreaks[exp?.id || ""] || false
            }
            wrap={false}
          >
            <View style={styles.experienceHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.experienceTitle}>
                  {safeRender(exp?.position)}
                </Text>
                <Text style={styles.experienceCompany}>
                  {safeRender(exp?.company)}
                </Text>
              </View>
              <Text style={styles.experienceDate}>
                {safeRender(exp?.startDate)} -{" "}
                {exp?.isCurrent
                  ? language === "fr"
                    ? "Présent"
                    : "Present"
                  : safeRender(exp?.endDate)}
              </Text>
            </View>
            {exp?.description && (
              <Text style={styles.experienceDescription}>
                {safeRender(exp.description)}
              </Text>
            )}
            {exp?.technologies &&
              Array.isArray(exp.technologies) &&
              exp.technologies.length > 0 && (
                <Text style={styles.experienceTech}>
                  {exp.technologies.map((tech) => safeRender(tech)).join(" • ")}
                </Text>
              )}
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    if (!isVisible("education") || educationList.length === 0) return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["education"] || false}
      >
        <Text style={styles.sectionTitle}>
          {getTranslatedTitle("education")}
        </Text>
        {educationList.map((edu, index) => (
          <View
            key={edu?.id || index}
            style={styles.educationItem}
            break={
              index === 0
                ? false
                : cvData.itemPageBreaks[edu?.id || ""] || false
            }
            wrap={false}
          >
            <Text style={styles.educationDegree}>
              {safeRender(edu?.degree)}
            </Text>
            <Text style={styles.educationInstitution}>
              {safeRender(edu?.institution)}
            </Text>
            <Text style={styles.educationDate}>
              {safeRender(edu?.startDate)} - {safeRender(edu?.endDate)}
            </Text>
            {edu?.grade && (
              <Text style={styles.educationGrade}>
                {language === "fr" ? "Note" : "Grade"}: {safeRender(edu.grade)}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!isVisible("projects") || projects.length === 0) return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["projects"] || false}
      >
        <Text style={styles.sectionTitle}>
          {getTranslatedTitle("projects")}
        </Text>
        {projects.map((proj, index) => (
          <View
            key={proj?.id || index}
            style={styles.projectItem}
            break={
              index === 0
                ? false
                : cvData.itemPageBreaks[proj?.id || ""] || false
            }
            wrap={false}
          >
            <Text style={styles.projectTitle}>{safeRender(proj?.title)}</Text>
            {proj?.description && (
              <Text style={styles.projectDescription}>
                {safeRender(proj.description)}
              </Text>
            )}
            {proj?.technologies &&
              Array.isArray(proj.technologies) &&
              proj.technologies.length > 0 && (
                <Text style={styles.projectTech}>
                  {proj.technologies
                    .map((tech) => safeRender(tech))
                    .join(" • ")}
                </Text>
              )}
            {(proj?.url || proj?.github) && (
              <View>
                {proj.url && (
                  <Text style={styles.projectLinks}>
                    {language === "fr" ? "Projet" : "Project"}:{" "}
                    {safeRender(proj.url)}
                  </Text>
                )}
                {proj.github && (
                  <Text style={styles.projectLinks}>
                    GitHub: {safeRender(proj.github)}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderCertifications = () => {
    if (!isVisible("certifications") || certifications.length === 0)
      return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["certifications"] || false}
      >
        <Text style={styles.sectionTitle}>
          {getTranslatedTitle("certifications")}
        </Text>
        {certifications.map((cert, index) => (
          <View
            key={cert?.id || index}
            style={styles.educationItem}
            break={
              index === 0
                ? false
                : cvData.itemPageBreaks[cert?.id || ""] || false
            }
          >
            <Text style={styles.educationDegree}>{safeRender(cert?.name)}</Text>
            <Text style={styles.educationInstitution}>
              {safeRender(cert?.issuer)}
            </Text>
            <Text style={styles.educationDate}>{safeRender(cert?.date)}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          {renderProfile()}
          {renderContact()}
          {renderSummary()}
          {renderLeftSkills()}
          {renderLeftLanguages()}
          {renderLeftInterests()}
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {renderExperiences()}
          {renderEducation()}
          {renderProjects()}
          {renderCertifications()}
        </View>
      </Page>
    </Document>
  );
};

export default ModernTemplate;
