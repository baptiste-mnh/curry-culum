import { SECTIONS_CONFIG } from "@/constants/sections";
import type { TemplateProps } from "@/types/app";
import {
  Education,
  Experience,
  Language,
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

const SeleniteTemplate: React.FC<TemplateProps> = ({ cvData }) => {
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

  // Color scheme matching the example
  const colors = {
    primary: theme?.primaryColor || "#4a7c8c",
    secondary: theme?.secondaryColor || "#2c5c6c",
    accent: theme?.accentColor || "#6a9fb5",
    text: "#333333",
    lightText: "#666666",
    white: "#ffffff",
    lightGray: "#f8f9fa",
    border: "#e0e0e0",
    blue: "#4a7c8c",
  };

  // Styles
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: getFontSize("text", "8px"),
      backgroundColor: colors.white,
      paddingTop: 20,
    },
    // Header section - blue background like the example
    header: {
      backgroundColor: colors.primary,
      padding: 10,
      marginTop: -20,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 150,
    },
    profileImageContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.white,
      marginRight: 30,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    profileImage: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.lightGray,
      objectFit: "cover",
    },
    headerContent: {
      flex: 1,
    },
    name: {
      fontSize: getFontSize("name", "24px"),
      fontWeight: "bold",
      color: colors.white,
      marginBottom: 8,
    },
    title: {
      fontSize: getFontSize("title", "16px"),
      color: colors.white,
      fontStyle: "italic",
      marginBottom: 10,
    },
    contactInfo: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 25,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    contactIcon: {
      width: 14,
      height: 14,
      backgroundColor: colors.white,
      borderRadius: 7,
    },
    contactText: {
      color: colors.white,
      fontSize: getFontSize("text", "11px"),
    },
    // Main content
    content: {
      padding: 30,
    },
    // Summary section - gray background like the example
    summarySection: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: colors.lightGray,
      borderLeft: `4px solid ${colors.primary}`,
    },
    summary: {
      fontSize: getFontSize("text", "9px"),
      color: colors.text,
      lineHeight: 1.6,
      textAlign: "justify",
    },
    // Section title with side bars like in the example
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
      marginTop: 5,
    },
    sideBar: {
      flex: 1,
      height: 3,
      backgroundColor: colors.primary,
    },
    sectionTitle: {
      fontSize: getFontSize("header", "14px"),
      fontWeight: "bold",
      color: colors.primary,
      paddingHorizontal: 20,
      textAlign: "center",
    },
    // Section styles
    section: {
      marginBottom: 30,
    },
    // Experience styles
    experienceItem: {
      marginBottom: 10,
      paddingBottom: 10,
      borderBottom: `1px solid ${colors.border}`,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    experienceLeft: {
      flex: 1,
    },
    experienceTitle: {
      fontSize: getFontSize("title", "14px"),
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    experienceCompany: {
      fontSize: getFontSize("text", "10px"),
      color: colors.primary,
      fontWeight: "bold",
      marginBottom: 6,
    },
    experienceDate: {
      fontSize: getFontSize("text", "10px"),
      color: colors.lightText,
      fontStyle: "italic",
      textAlign: "right",
      minWidth: 120,
    },
    experienceDescription: {
      fontSize: getFontSize("text", "12px"),
      color: colors.text,
      lineHeight: 1.5,
      marginBottom: 10,
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 2,
      paddingLeft: 15,
    },
    bullet: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: colors.primary,
      marginRight: 10,
      marginTop: 6,
    },
    bulletText: {
      fontSize: getFontSize("text", "10px"),
      color: colors.text,
      flex: 1,
      lineHeight: 1.5,
    },
    technologiesContainer: {
      marginLeft: 10,
      marginTop: 10,
    },
    technologiesTitle: {
      fontSize: getFontSize("title", "10px"),
      fontWeight: "bold",
      color: colors.text,
    },
    technologiesList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      margin: 5,
    },
    technologyTag: {
      backgroundColor: colors.accent,
      color: colors.white,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 15,
      fontSize: getFontSize("tags", "10px"),
      fontWeight: "bold",
    },
    // Education styles
    educationItem: {
      marginBottom: 5,
      paddingBottom: 5,
      borderBottom: `1px solid ${colors.border}`,
    },
    educationHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 5,
    },
    educationDegree: {
      fontSize: getFontSize("text", "10px"),
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    educationInstitution: {
      fontSize: 10,
      color: colors.primary,
      marginBottom: 4,
    },
    educationDateLine: {
      fontSize: 10,
      color: colors.lightText,
      textAlign: "right",
      marginBottom: 8,
    },
    // Skills styles - two column layout for skills
    skillsContainer: {
      flexDirection: "row",
      gap: 4,
    },
    skillsColumn: {
      flex: 1,
    },
    skillCategory: {
      marginBottom: 10,
    },
    skillCategoryTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 10,
      paddingBottom: 5,
      borderBottom: `2px solid ${colors.border}`,
    },
    skillsList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    skillTag: {
      backgroundColor: colors.primary,
      color: colors.white,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 8,
      fontSize: 8,
      fontWeight: "bold",
    },
    // Language styles with flags
    languagesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    languagesList: {
      flex: 1,
    },
    languageItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      paddingBottom: 8,
      borderBottom: `1px solid ${colors.border}`,
    },
    languageName: {
      fontSize: 11,
      color: colors.text,
      fontWeight: "bold",
    },
    languageLevel: {
      fontSize: 10,
      color: colors.lightText,
    },
    flagsContainer: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      marginLeft: 30,
    },
    flag: {
      width: 24,
      height: 18,
      borderRadius: 3,
      backgroundColor: colors.primary,
      border: `1px solid ${colors.border}`,
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

  const isVisible = () => true;

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

  // Split description into bullet points
  const formatDescription = (description: string) => {
    const points = description.split("\n").filter((point) => point.trim());
    return points;
  };

  // Render section title with side bars
  const renderSectionTitle = (title: string) => (
    <View style={styles.sectionTitleContainer}>
      <View style={styles.sideBar} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sideBar} />
    </View>
  );

  // Render functions
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.profileImageContainer}>
        {personalInfo?.photoUrl ? (
          <Image src={personalInfo.photoUrl} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImage} />
        )}
      </View>
      <View style={styles.headerContent}>
        <Text style={styles.name}>
          {safeRender(personalInfo?.firstName)}{" "}
          {safeRender(personalInfo?.lastName)}
        </Text>
        {personalInfo?.title && (
          <Text style={styles.title}>{safeRender(personalInfo.title)}</Text>
        )}
        <View style={styles.contactInfo}>
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
      </View>
    </View>
  );

  const renderSummary = () => {
    if (!personalInfo?.summary) return null;

    return (
      <View
        style={styles.summarySection}
        break={cvData.sectionStartPage["personalInfo"] || false}
      >
        <Text style={styles.summary}>{safeRender(personalInfo.summary)}</Text>
      </View>
    );
  };

  const renderExperiences = () => {
    if (!isVisible() || experiences.length === 0) return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["experiences"] || false}
      >
        {renderSectionTitle(getTranslatedTitle("experiences"))}
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
              <View style={styles.experienceLeft}>
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
                    ? "Aujourd'hui"
                    : "Today"
                  : safeRender(exp?.endDate)}
              </Text>
            </View>
            {exp?.description && (
              <View>
                {formatDescription(exp.description).map((point, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}
            {exp?.technologies && (
              <View style={styles.technologiesContainer}>
                <Text style={styles.technologiesTitle}>Skills</Text>
                <View style={styles.technologiesList}>
                  {exp.technologies.map((tech, idx) => (
                    <Text key={idx} style={styles.technologyTag}>
                      {safeRender(tech)}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    if (!isVisible() || educationList.length === 0) return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["education"] || false}
      >
        {renderSectionTitle(getTranslatedTitle("education"))}
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
            <View style={styles.educationHeader}>
              <Text style={styles.educationDegree}>
                {safeRender(edu?.degree)}
              </Text>
              <Text style={styles.educationDateLine}>
                {safeRender(edu?.startDate)} - {safeRender(edu?.endDate)}
              </Text>
            </View>
            <Text style={styles.educationInstitution}>
              {safeRender(edu?.institution)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (!isVisible() || skillCategories.length === 0) return null;

    // Split skills into two columns
    const midpoint = Math.ceil(skillCategories.length / 2);
    const leftSkills = skillCategories.slice(0, midpoint);
    const rightSkills = skillCategories.slice(midpoint);

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["skillCategories"] || false}
      >
        {renderSectionTitle(getTranslatedTitle("skillCategories"))}
        <View style={styles.skillsContainer}>
          <View style={styles.skillsColumn}>
            {leftSkills.map((cat, index) => (
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
                <View style={styles.skillsList}>
                  {cat?.skills &&
                    Array.isArray(cat.skills) &&
                    cat.skills.map((skill, idx) => (
                      <Text key={idx} style={styles.skillTag}>
                        {safeRender(skill)}
                      </Text>
                    ))}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.skillsColumn}>
            {rightSkills.map((cat, index) => (
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
                <View style={styles.skillsList}>
                  {cat?.skills &&
                    Array.isArray(cat.skills) &&
                    cat.skills.map((skill, idx) => (
                      <Text key={idx} style={styles.skillTag}>
                        {safeRender(skill)}
                      </Text>
                    ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderLanguages = () => {
    if (!isVisible() || languages.length === 0) return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["languages"] || false}
      >
        {renderSectionTitle(getTranslatedTitle("languages"))}
        <View style={styles.languagesContainer}>
          <View style={styles.languagesList}>
            {languages.map((lang, index) => (
              <View
                key={lang?.id || index}
                style={styles.languageItem}
                break={
                  index === 0
                    ? false
                    : cvData.itemPageBreaks[lang?.id || ""] || false
                }
                wrap={false}
              >
                <Text style={styles.languageName}>
                  {safeRender(lang?.name)}
                </Text>
                <Text style={styles.languageLevel}>
                  {safeRender(lang?.level)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}

        <View style={styles.content}>
          {renderSummary()}
          {renderExperiences()}
          {renderEducation()}
          {renderSkills()}
          {renderLanguages()}
        </View>
      </Page>
    </Document>
  );
};

export default SeleniteTemplate;
