import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { Project, CVSection } from "@/types/cv";
import { generateId } from "@/utils/cv";

const ProjectsForm: React.FC = () => {
  const { cvData, updateCVData, updateItemPageBreak } = useCVDataContext();
  const [newTechnology, setNewTechnology] = useState("");

  // Find the projects section
  const projectsSection = cvData.sections.find(
    (section) => section.type === "projects"
  ) as CVSection;
  const projects: Project[] = (projectsSection?.data as Project[]) || [];

  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      title: "",
      description: "",
      technologies: [],
      url: "",
      github: "",
    };

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "projects") {
        return {
          ...section,
          data: [...projects, newProject],
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map((project) =>
      project.id === id ? { ...project, ...updates } : project
    );

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "projects") {
        return {
          ...section,
          data: updatedProjects,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id);

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "projects") {
        return {
          ...section,
          data: updatedProjects,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const moveProject = (id: string, direction: "up" | "down") => {
    const currentIndex = projects.findIndex((project) => project.id === id);
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === "up" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === "down" && currentIndex < projects.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return; // Can't move further
    }

    const newProjects = [...projects];
    [newProjects[currentIndex], newProjects[newIndex]] = [
      newProjects[newIndex],
      newProjects[currentIndex],
    ];

    const updatedSections = cvData.sections.map((section) => {
      if (section.type === "projects") {
        return {
          ...section,
          data: newProjects,
        };
      }
      return section;
    });

    updateCVData({
      ...cvData,
      sections: updatedSections,
    });
  };

  const addTechnology = (projectId: string) => {
    if (!newTechnology.trim()) return;

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const updatedTechnologies = [...project.technologies, newTechnology.trim()];
    updateProject(projectId, { technologies: updatedTechnologies });
    setNewTechnology("");
  };

  const removeTechnology = (projectId: string, technology: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const updatedTechnologies = project.technologies.filter(
      (tech) => tech !== technology
    );
    updateProject(projectId, { technologies: updatedTechnologies });
  };

  const renderProjectItem = (project: Project, index: number) => (
    <Card key={project.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Project {index + 1}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveProject(project.id, "up")}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveProject(project.id, "down")}
                disabled={index === projects.length - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeProject(project.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`project-title-${project.id}`}>Project Title</Label>
          <Input
            id={`project-title-${project.id}`}
            value={project.title}
            onChange={(e) =>
              updateProject(project.id, { title: e.target.value })
            }
            placeholder="My Awesome Project"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`project-description-${project.id}`}>
            Description
          </Label>
          <Textarea
            id={`project-description-${project.id}`}
            value={project.description}
            onChange={(e) =>
              updateProject(project.id, { description: e.target.value })
            }
            placeholder="Describe your project, its purpose, and your role..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`project-url-${project.id}`}>Live URL</Label>
            <Input
              id={`project-url-${project.id}`}
              value={project.url || ""}
              onChange={(e) =>
                updateProject(project.id, { url: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`project-github-${project.id}`}>GitHub URL</Label>
            <Input
              id={`project-github-${project.id}`}
              value={project.github || ""}
              onChange={(e) =>
                updateProject(project.id, { github: e.target.value })
              }
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Technologies</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {project.technologies.map((tech, techIndex) => (
              <Badge
                key={techIndex}
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>{tech}</span>
                <button
                  onClick={() => removeTechnology(project.id, tech)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              placeholder="Add technology..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTechnology(project.id);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => addTechnology(project.id)}
              disabled={!newTechnology.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`pageBreak-${project.id}`}
            checked={cvData.itemPageBreaks[project.id] || false}
            onCheckedChange={(checked) => {
              updateItemPageBreak(project.id, checked);
            }}
          />
          <Label htmlFor={`pageBreak-${project.id}`}>Move to page start</Label>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Projects</h3>
        <Button onClick={addProject} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No projects added yet.</p>
          <p className="text-sm">Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project, index) => renderProjectItem(project, index))}
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
