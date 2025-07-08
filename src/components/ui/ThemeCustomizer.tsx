import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { ThemeConfig } from "@/types/cv";
import { Palette, Type } from "lucide-react";
import React from "react";

const ThemeCustomizer: React.FC = () => {
  const { cvData, updateCVData } = useCVDataContext();

  const handleColorChange = (newTheme: ThemeConfig) => {
    updateCVData({
      ...cvData,
      theme: newTheme,
    });
  };

  const handleFontSizeChange = (
    fontSizeType: "name" | "title" | "header" | "text" | "tags",
    value: number[]
  ) => {
    const currentFontSize = cvData.theme.fontSize || {
      name: "24px",
      title: "16px",
      header: "14px",
      text: "12px",
      tags: "10px",
    };

    updateCVData({
      ...cvData,
      theme: {
        ...cvData.theme,
        fontSize: {
          ...currentFontSize,
          [fontSizeType]: `${value[0]}px`,
        },
      },
    });
  };

  // Ensure fontSize exists with default values
  const fontSize = cvData.theme.fontSize || {
    name: "18px",
    title: "14px",
    header: "12px",
    text: "10px",
    tags: "8px",
  };

  // Helper function to extract numeric value from px string
  const getNumericValue = (pxValue: string) => {
    return parseInt(pxValue.replace("px", ""), 10);
  };

  const presetColors = [
    {
      name: "Sage",
      primary: "#5a7a5a",
      secondary: "#4a6a4a",
      accent: "#7a9a7a",
    },
    {
      name: "Lavender",
      primary: "#8a7aac",
      secondary: "#7a6a9c",
      accent: "#a89ac9",
    },
    {
      name: "Mint",
      primary: "#5a8a7a",
      secondary: "#4a7a6a",
      accent: "#7aaa9a",
    },
    {
      name: "Coral",
      primary: "#c57367",
      secondary: "#b56357",
      accent: "#d58377",
    },
    {
      name: "Steel",
      primary: "#5a7a9a",
      secondary: "#4a6a8a",
      accent: "#7a9aba",
    },
    {
      name: "Peach",
      primary: "#c59273",
      secondary: "#b58263",
      accent: "#d5a283",
    },
    {
      name: "Periwinkle",
      primary: "#8a7aa3",
      secondary: "#7a6a93",
      accent: "#a89ac0",
    },
    {
      name: "Dusty Rose",
      primary: "#a47575",
      secondary: "#946565",
      accent: "#b48585",
    },
    {
      name: "Slate",
      primary: "#5a7a9a",
      secondary: "#4a6a8a",
      accent: "#7a9aba",
    },
    {
      name: "Cream",
      primary: "#b0a682",
      secondary: "#a09672",
      accent: "#c0b692",
    },
  ];

  const ColorPicker = ({
    label,
    color,
    onChange,
  }: {
    label: string;
    color: string;
    onChange: (color: string) => void;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
        />
        <span className="text-sm text-gray-600 font-mono">{color}</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Theme Customization</h3>
          <p className="text-sm text-gray-600">
            Customize colors and fonts for your CV
          </p>
        </div>

        <Separator />

        {/* Color Customization */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <Label className="font-medium">Colors</Label>
          </div>

          <div className="flex space-y-3">
            <ColorPicker
              label="Primary Color"
              color={cvData.theme.primaryColor}
              onChange={(color) =>
                handleColorChange({
                  ...cvData.theme,
                  primaryColor: color,
                })
              }
            />
            <ColorPicker
              label="Secondary Color"
              color={cvData.theme.secondaryColor}
              onChange={(color) =>
                handleColorChange({
                  ...cvData.theme,
                  secondaryColor: color,
                })
              }
            />
            <ColorPicker
              label="Accent Color"
              color={cvData.theme.accentColor}
              onChange={(color) =>
                handleColorChange({
                  ...cvData.theme,
                  accentColor: color,
                })
              }
            />
          </div>

          {/* Preset Colors */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preset Themes</Label>
            <div className="grid grid-cols-4 gap-2">
              {presetColors.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center space-y-1 p-2 h-auto"
                  onClick={() => {
                    handleColorChange({
                      ...cvData.theme,
                      primaryColor: preset.primary,
                      secondaryColor: preset.secondary,
                      accentColor: preset.accent,
                    });
                  }}
                >
                  <div className="flex space-x-1">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className="text-xs break-words text-center whitespace-pre-line">
                    {preset.name.replace(/ /g, "\n")}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Font Size Customization */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4" />
            <Label className="font-medium">Font Sizes</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Name</Label>
              <Slider
                value={[getNumericValue(fontSize.name)]}
                onValueChange={(value) => handleFontSizeChange("name", value)}
                min={10}
                max={40}
                step={1}
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>10px</span>
                <span className="font-medium">{fontSize.name}</span>
                <span>40px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Title</Label>
              <Slider
                value={[getNumericValue(fontSize.title)]}
                onValueChange={(value) => handleFontSizeChange("title", value)}
                min={8}
                max={24}
                step={1}
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>8px</span>
                <span className="font-medium">{fontSize.title}</span>
                <span>24px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Header</Label>
              <Slider
                value={[getNumericValue(fontSize.header)]}
                onValueChange={(value) => handleFontSizeChange("header", value)}
                min={8}
                max={20}
                step={1}
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>8px</span>
                <span className="font-medium">{fontSize.header}</span>
                <span>20px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Text</Label>
              <Slider
                value={[getNumericValue(fontSize.text)]}
                onValueChange={(value) => handleFontSizeChange("text", value)}
                min={6}
                max={18}
                step={1}
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>6px</span>
                <span className="font-medium">{fontSize.text}</span>
                <span>18px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tags</Label>
              <Slider
                value={[getNumericValue(fontSize.tags)]}
                onValueChange={(value) => handleFontSizeChange("tags", value)}
                min={6}
                max={14}
                step={1}
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>6px</span>
                <span className="font-medium">{fontSize.tags}</span>
                <span>14px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
