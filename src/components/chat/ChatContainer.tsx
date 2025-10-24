import React, { useState, useEffect } from "react";
import { ChatSetup } from "./ChatSetup";
import { ChatInterface } from "./ChatInterface";
import { getMistralApiKey, hasMistralApiKey, removeMistralApiKey } from "@/utils/secureStorage";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const ChatContainer: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        if (hasMistralApiKey()) {
          const key = await getMistralApiKey();
          setApiKey(key);
        }
      } catch (error) {
        console.error("Failed to load API key:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, []);

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    setShowSetup(false);
  };

  const handleRemoveApiKey = () => {
    removeMistralApiKey();
    setApiKey(null);
    setShowSetup(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!apiKey || showSetup) {
    return (
      <div className="h-full flex flex-col">
        <ChatSetup onApiKeySet={handleApiKeySet} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Settings button */}
      <div className="p-2 border-b flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete API key?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to delete your stored Mistral AI API key? You will need
                to enter it again to use the assistant.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveApiKey}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Chat interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface apiKey={apiKey} />
      </div>
    </div>
  );
};
