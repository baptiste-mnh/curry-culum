import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVDataContext } from "@/hooks/useCVDataContext";
import { toast } from "sonner";
import { loadFromLocalStorage } from "@/utils/localStorage";

interface HomePageProps {
  onStartEditing: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartEditing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { createNewCV, loadCVData } = useCVDataContext();
  const savedDataExists = loadFromLocalStorage() !== null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid JSON file");
    }
  };

  const handleImportJSON = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      const text = await selectedFile.text();
      loadCVData(text);
      onStartEditing();
      toast.success("CV data imported successfully");
    } catch (_e) {
      toast.error("Invalid JSON file or corrupted data");
      console.error(_e);
    }
  };

  const handleCreateNew = () => {
    createNewCV();
    onStartEditing();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">CV Builder</h1>
          <p className="text-xl text-gray-600">
            Create professional resumes with ease
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resume or Create New CV */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>
                {savedDataExists ? "Resume My CV" : "Create New CV"}
              </CardTitle>
              <CardDescription>
                {savedDataExists
                  ? "Continue editing your saved CV"
                  : "Start with a blank template and build your CV from scratch"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => {
                  if (savedDataExists) {
                    onStartEditing();
                  } else {
                    handleCreateNew();
                  }
                }}
                className="w-full"
                size="lg"
              >
                {savedDataExists ? "Resume Editing" : "Start Creating"}
              </Button>
            </CardContent>
          </Card>

          {/* Import JSON */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Import Existing CV</CardTitle>
              <CardDescription>
                Load a previously saved CV from a JSON file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-file">Select JSON file</Label>
                <Input
                  id="json-file"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              <Button
                onClick={handleImportJSON}
                className="w-full"
                size="lg"
                disabled={!selectedFile}
              >
                Import CV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
