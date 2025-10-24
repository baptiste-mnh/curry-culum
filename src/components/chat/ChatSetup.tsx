import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ExternalLink, Sparkles } from "lucide-react";
import { saveMistralApiKey } from "@/utils/secureStorage";

interface ChatSetupProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ChatSetup: React.FC<ChatSetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!apiKey.trim()) {
      setError("Veuillez entrer une clé API");
      return;
    }

    setIsLoading(true);

    try {
      await saveMistralApiKey(apiKey.trim());
      onApiKeySet(apiKey.trim());
    } catch (err) {
      console.error("Failed to save API key:", err);
      setError("Error saving API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6 bg-white overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <p className="text-sm text-gray-600">
          Use AI to automatically improve and modify your resume
        </p>
      </div>

      {/* Features */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-blue-900">What can the assistant do?</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Improve the wording of your experiences</li>
          <li>Suggest relevant skills</li>
          <li>Rewrite your professional summary</li>
          <li>Adapt content according to target position</li>
          <li>Correct spelling and grammar</li>
        </ul>
      </div>

      {/* API Key Setup */}
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Configuration required</p>
              <p className="mt-1">
                To use this assistant, you must provide a Mistral AI API key.
                This key will be securely stored in your browser and never shared.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Mistral AI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save API key"}
          </Button>
        </form>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            How to get an API key?
          </h4>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>
              Create an account on{" "}
              <a
                href="https://console.mistral.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                console.mistral.ai
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </li>
            <li>Configure your organization and payment information</li>
            <li>
              Go to the{" "}
              <a
                href="https://console.mistral.ai/api-keys/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                API Keys
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              {" "}page
            </li>
            <li>Create a new key and copy it here</li>
          </ol>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            <strong>Security note:</strong> Your API key is encrypted before
            being stored locally in your browser. It is never transmitted to our
            servers. Keep it confidential and never share it.
          </p>
        </div>
      </div>
    </div>
  );
};
