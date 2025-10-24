import React from "react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const hasCvData = !isUser && message.cvDataJson;

  const handleDownload = () => {
    if (!message.cvDataJson) return;

    const blob = new Blob([message.cvDataJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cv-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-2",
          isUser
            ? "bg-blue-600 text-white"
            : message.isError
            ? "bg-red-100 text-red-900 border border-red-300"
            : "bg-gray-100 text-gray-900"
        )}
      >
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div
          className={cn(
            "flex items-center justify-between gap-2 mt-1",
            isUser ? "text-blue-100" : "text-gray-500"
          )}
        >
          <span className="text-xs">
            {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {hasCvData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-6 px-2 text-xs hover:bg-gray-200"
            >
              <Download className="w-3 h-3 mr-1" />
              JSON
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
