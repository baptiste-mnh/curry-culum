import React from "react";

// Component to prevent div from being cut between pages
export const NoBreakDiv: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = "", style = {} }) => {
  return (
    <div
      className={`no-page-break ${className}`}
      style={{
        pageBreakInside: "avoid",
        breakInside: "avoid",
        display: "block",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Component to protect text from being cut
export const NoBreakText: React.FC<{
  children: React.ReactNode;
  as?: "p" | "div" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, as: Component = "p", className = "", style = {} }) => {
  return (
    <Component
      className={`no-text-break ${className}`}
      style={{
        pageBreakInside: "avoid",
        breakInside: "avoid",
        orphans: 3,
        widows: 3,
        ...style,
      }}
    >
      {children}
    </Component>
  );
};

// Component for sections that should stay together
export const Section: React.FC<{
  children: React.ReactNode;
  title?: string;
  className?: string;
}> = ({ children, title, className = "" }) => {
  return (
    <NoBreakDiv className={`section-container ${className}`}>
      {title && (
        <NoBreakText
          as="h2"
          className="section-title text-xl font-bold text-blue-600 mb-4"
        >
          {title}
        </NoBreakText>
      )}
      <div className="section-content">{children}</div>
    </NoBreakDiv>
  );
};

// Component for bullet points that shouldn't be separated
export const BulletPoint: React.FC<{
  children: React.ReactNode;
  bulletColor?: string;
  bulletStyle?: React.CSSProperties;
}> = ({ children, bulletColor = "bg-blue-500", bulletStyle = {} }) => {
  return (
    <NoBreakDiv className="bullet-point-container">
      <div className="flex items-start space-x-3 mb-3">
        <div
          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0`}
          style={{
            backgroundColor: bulletColor.startsWith("bg-")
              ? undefined
              : bulletColor,
            ...bulletStyle,
          }}
        ></div>
        <NoBreakText className="text-gray-700 flex-1">{children}</NoBreakText>
      </div>
    </NoBreakDiv>
  );
};

// Component for experience items that should stay together
export const ExperienceItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <NoBreakDiv className={`experience-item ${className}`}>
      {children}
    </NoBreakDiv>
  );
};

// Component for education items that should stay together
export const EducationItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = "", style = {} }) => {
  return (
    <NoBreakDiv className={`education-item ${className}`} style={style}>
      {children}
    </NoBreakDiv>
  );
};

// Component for project items that should stay together
export const ProjectItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = "", style = {} }) => {
  return (
    <NoBreakDiv className={`project-item ${className}`} style={style}>
      {children}
    </NoBreakDiv>
  );
};

// Component for certification items that should stay together
export const CertificationItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = "", style = {} }) => {
  return (
    <NoBreakDiv className={`certification-item ${className}`} style={style}>
      {children}
    </NoBreakDiv>
  );
};
