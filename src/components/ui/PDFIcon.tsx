import { Path, Svg } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";

// Pre-defined icon paths for common Lucide icons
const iconPaths: Record<string, string> = {
  MapPin:
    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  Mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  Phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  Globe:
    "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z M8 12h8 M12 8c2.5 0 4.5 2 4.5 4.5S14.5 16 12 16s-4.5-2-4.5-4.5S9.5 8 12 8z",
  User: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  Calendar:
    "M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z M8 2v4 M16 2v4 M3 10h18",
  Github:
    "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  Linkedin:
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  ExternalLink:
    "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3",
  Award: "M7 7h10v10l-5 3-5-3V7z M7 7l5-5 5 5",
  Briefcase:
    "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M8 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4",
  GraduationCap:
    "M22 10v6M6 12H2l10-6 10 6-10 6-4-2.4 M6 12v7c0 1-1 2-2 2s-2-1-2-2v-7",
};

interface PDFIconProps {
  icon: keyof typeof iconPaths;
  style?: Style;
  size?: number;
  strokeWidth?: number;
}

const LucideIcon = ({
  icon,
  style = {},
  size = 24,
  strokeWidth = 2,
}: PDFIconProps) => {
  const pathData = iconPaths[icon];

  // If we don't have the path data, return null
  if (!pathData) {
    console.warn(`Icon path not found for: ${icon}`);
    return null;
  }

  const stroke =
    typeof style?.color === "string" ? style.color : "currentColor";

  return (
    <Svg
      viewBox="0 0 24 24"
      style={{
        width: size,
        height: size,
        color: "red",
        ...style,
      }}
    >
      {pathData.split(" M").map((pathSegment, index) => {
        const d = index === 0 ? pathSegment : `M${pathSegment}`;
        if (!d.trim()) return null;

        return (
          <Path
            key={index}
            d={d}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      })}
    </Svg>
  );
};

export default LucideIcon;
