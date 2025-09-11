import { SECTIONS_CONFIG } from "@/constants/sections";
import type { TemplateProps } from "@/types/app";
import {
  Certification,
  Education,
  Experience,
  Interest,
  Language,
  Project,
  SectionType,
  SkillCategory,
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

const SimpleTemplatePDF: React.FC<TemplateProps> = ({ cvData }) => {
  const { personalInfo, sections, language, theme } = cvData;

  // Color scheme
  const colors = {
    primary: theme?.primaryColor || "#000000",
    secondary: theme?.secondaryColor || "#666666",
    accent: theme?.accentColor || "#000000",
    text: "#333333",
    lightText: "#666666",
    border: "#cccccc",
  };

  // Styles
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: 10,
      lineHeight: 1.4,
      paddingTop: 30,
      paddingBottom: 30,
      paddingHorizontal: 30,
      backgroundColor: "#ffffff",
    },
    // Header styles
    header: {
      textAlign: "center",
      marginBottom: 25,
      paddingBottom: 15,
      borderBottom: `2px solid ${colors.accent}`,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 15,
      alignSelf: "center",
      objectFit: "cover",
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 15,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 10,
    },
    contactInfo: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 15,
      marginBottom: 10,
      fontSize: 9,
      color: colors.lightText,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      marginHorizontal: 5,
    },
    summary: {
      textAlign: "center",
      color: colors.text,
      fontSize: 10,
      lineHeight: 1.5,
      maxWidth: "80%",
      marginHorizontal: "auto",
    },
    // Section styles - Use minPresenceAhead to avoid cutting elements
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 10,
      paddingBottom: 3,
      borderBottom: `2px solid ${colors.accent}`,
    },
    // Experience styles
    experienceItem: {
      marginBottom: 15,
      paddingLeft: 10,
      borderLeft: `3px solid ${colors.accent}`,
      break: false, // Prevent breaking individual experience items
    },
    experienceTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 2,
    },
    experienceCompany: {
      fontSize: 11,
      fontWeight: "bold",
      color: colors.lightText,
      marginBottom: 2,
    },
    experienceDate: {
      fontSize: 9,
      color: colors.lightText,
      marginBottom: 5,
    },
    experienceDescription: {
      fontSize: 10,
      color: colors.text,
      lineHeight: 1.4,
      marginBottom: 5,
    },
    experienceTech: {
      fontSize: 9,
      color: colors.lightText,
    },
    // Education styles
    educationItem: {
      marginBottom: 12,
      paddingLeft: 10,
      borderLeft: `3px solid ${colors.accent}`,
    },
    educationDegree: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 2,
    },
    educationInstitution: {
      fontSize: 11,
      fontWeight: "bold",
      color: colors.lightText,
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
      marginBottom: 3,
    },
    educationDescription: {
      fontSize: 9,
      color: colors.text,
    },
    // Skills styles
    skillCategory: {
      marginBottom: 12,
    },
    skillCategoryTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 5,
    },
    skillTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 5,
    },
    skillTag: {
      backgroundColor: colors.accent + "20",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      fontSize: 9,
      color: colors.text,
    },
    // Project styles
    projectItem: {
      marginBottom: 12,
      paddingLeft: 10,
      borderLeft: `3px solid ${colors.accent}`,
    },
    projectTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 3,
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
      color: "#0066cc",
    },
    // Certification styles
    certificationItem: {
      marginBottom: 10,
      paddingLeft: 10,
      borderLeft: `3px solid ${colors.accent}`,
      break: false, // Prevent breaking individual certification items
    },
    certificationName: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 2,
    },
    certificationIssuer: {
      fontSize: 10,
      color: colors.lightText,
      marginBottom: 2,
    },
    certificationDate: {
      fontSize: 9,
      color: colors.lightText,
    },
    // Language styles
    languageContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 15,
    },
    languageItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    languageName: {
      fontSize: 10,
      fontWeight: "bold",
      color: colors.text,
    },
    languageLevel: {
      fontSize: 10,
      color: colors.lightText,
    },
    // Interests styles
    interestTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    interestItem: {
      marginBottom: 8,
    },
    interestTag: {
      backgroundColor: colors.accent + "20",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      fontSize: 9,
      color: colors.text,
      fontWeight: "bold",
    },
    interestDescription: {
      fontSize: 8,
      color: colors.lightText,
      marginTop: 2,
      paddingLeft: 4,
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
  const softSkills = getSafeArrayData<string>("softSkills");
  const languages = getSafeArrayData<Language>("languages");
  const projects = getSafeArrayData<Project>("projects");
  const certifications = getSafeArrayData<Certification>("certifications");
  const interests = getSafeArrayData<Interest>("interests");

  // Render functions
  const renderPersonalInfo = () => (
    <View style={styles.header}>
      {personalInfo?.photoUrl && (
        <Image src={personalInfo.photoUrl} style={styles.profileImage} />
      )}
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
            <Text>{safeRender(personalInfo.email)}</Text>
          </View>
        )}
        {personalInfo?.phone && (
          <Text style={styles.contactItem}>
            {safeRender(personalInfo.phone)}
          </Text>
        )}
        {personalInfo?.address && (
          <View style={styles.contactItem}>
            <Text>{safeRender(personalInfo.address)}</Text>
          </View>
        )}
      </View>
      {personalInfo?.summary && (
        <Text style={styles.summary}>{safeRender(personalInfo.summary)}</Text>
      )}
    </View>
  );

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
            <Text style={styles.experienceTitle}>
              {safeRender(exp?.position)}
            </Text>
            <Text style={styles.experienceCompany}>
              {safeRender(exp?.company)}
            </Text>
            <Text style={styles.experienceDate}>
              {safeRender(exp?.startDate)} -{" "}
              {exp?.isCurrent ? "Present" : safeRender(exp?.endDate)}
            </Text>
            {exp?.description && (
              <Text style={styles.experienceDescription}>
                {safeRender(exp.description)}
              </Text>
            )}
            {exp?.technologies &&
              Array.isArray(exp.technologies) &&
              exp.technologies.length > 0 && (
                <Text style={styles.experienceTech}>
                  <Text style={{ fontWeight: "bold" }}>Technologies:</Text>{" "}
                  {exp.technologies.map((tech) => safeRender(tech)).join(", ")}
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
                <Text style={{ fontWeight: "bold" }}>Grade:</Text>{" "}
                {safeRender(edu.grade)}
              </Text>
            )}
            {edu?.description && (
              <Text style={styles.educationDescription}>
                {safeRender(edu.description)}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (!isVisible("skillCategories") || skillCategories.length === 0)
      return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["skillCategories"] || false}
      >
        <Text style={styles.sectionTitle}>
          {getTranslatedTitle("skillCategories")}
        </Text>
        {skillCategories.map((cat, index) => (
          <View
            key={cat?.id || index}
            style={styles.skillCategory}
            minPresenceAhead={40}
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
            <View style={styles.skillTags}>
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
    );
  };

  const renderSoftSkills = () => {
    if (!isVisible("softSkills") || softSkills.length === 0) return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["softSkills"] || false}
      >
        <Text style={styles.sectionTitle}>
          {getTranslatedTitle("softSkills")}
        </Text>
        <View style={styles.skillTags}>
          {softSkills.map((skill, idx) => (
            <Text key={idx} style={styles.skillTag}>
              {safeRender(skill)}
            </Text>
          ))}
        </View>
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
                  <Text style={{ fontWeight: "bold" }}>Technologies:</Text>{" "}
                  {proj.technologies.map((tech) => safeRender(tech)).join(", ")}
                </Text>
              )}
            {(proj?.url || proj?.github) && (
              <View>
                {proj.url && (
                  <Text style={styles.projectLinks}>
                    Project: {safeRender(proj.url)}
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
            style={styles.certificationItem}
            break={
              index === 0
                ? false
                : cvData.itemPageBreaks[cert?.id || ""] || false
            }
            wrap={false}
          >
            <Text style={styles.certificationName}>
              {safeRender(cert?.name)}
            </Text>
            <Text style={styles.certificationIssuer}>
              {safeRender(cert?.issuer)}
            </Text>
            <Text style={styles.certificationDate}>
              {safeRender(cert?.date)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderLanguages = () => {
    if (!isVisible("languages") || languages.length === 0) return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["languages"] || false}
      >
        <Text style={styles.sectionTitle}>
          {getTranslatedTitle("languages")}
        </Text>
        <View style={styles.languageContainer}>
          {languages.map((lang, index) => (
            <View key={lang?.id || index} style={styles.languageItem}>
              <Text style={styles.languageName}>{safeRender(lang?.name)}:</Text>
              <Text style={styles.languageLevel}>
                {safeRender(lang?.level)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderInterests = () => {
    if (!isVisible("interests") || interests.length === 0) return null;

    return (
      <View
        style={styles.section}
        break={cvData.sectionStartPage["interests"] || false}
      >
        <Text style={styles.sectionTitle}>
          {getTranslatedTitle("interests")}
        </Text>
        <View style={styles.interestTags}>
          {interests.map((interest, idx) => (
            <View key={interest.id || idx} style={styles.interestItem}>
              <Text style={styles.interestTag}>
                {safeRender(interest.name)}
              </Text>
              {interest.description && (
                <Text style={styles.interestDescription}>
                  {safeRender(interest.description)}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSection = (sectionType: SectionType) => {
    switch (sectionType) {
      case "experiences":
        return renderExperiences();
      case "education":
        return renderEducation();
      case "skillCategories":
        return renderSkills();
      case "softSkills":
        return renderSoftSkills();
      case "projects":
        return renderProjects();
      case "certifications":
        return renderCertifications();
      case "languages":
        return renderLanguages();
      case "interests":
        return renderInterests();
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderPersonalInfo()}

        {cvData.sectionOrder?.map((sectionType) => {
          if (sectionType === "personalInfo") return null;
          return renderSection(sectionType as SectionType);
        })}
      </Page>
    </Document>
  );
};

export default SimpleTemplatePDF;
