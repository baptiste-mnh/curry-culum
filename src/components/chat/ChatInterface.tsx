import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, Loader2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { useMistralChat } from "@/hooks/useMistralChat";
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

interface ChatInterfaceProps {
  apiKey: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey }) => {
  const [inputMessage, setInputMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, clearConversation } = useMistralChat({
    apiKey,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const message = inputMessage.trim();
    setInputMessage("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClearConversation = () => {
    clearConversation();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div>
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          <p className="text-xs text-gray-500">
            {messages.length} message{messages.length > 1 ? "s" : ""}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={messages.length === 0}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete all messages in this conversation.
                This action is irreversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearConversation}>
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden bg-white">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <Send className="w-8 h-8 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Start a conversation
                  </p>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Ask the assistant to improve your resume, rewrite a section, or add content.
                  </p>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Example questions:</p>
                  <ul className="list-disc list-inside text-left">
                    <li>Improve my professional summary</li>
                    <li>Add skills for a developer position</li>
                    <li>Rewrite my last experience</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Assistant is thinking...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your question... (Shift+Enter for new line)"
            className="min-h-[80px] resize-none"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Enter to send • Shift+Enter for new line
            </p>
            <Button type="submit" disabled={!inputMessage.trim() || isLoading} size="sm">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
