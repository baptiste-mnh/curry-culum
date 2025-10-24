import { useState, useCallback, useRef } from "react";
import { Mistral } from "@mistralai/mistralai";
import type { CVData } from "@/types/cv";
import type { ChatMessage, ChatState, MistralChatConfig } from "@/types/chat";
import { DEFAULT_MISTRAL_CONFIG } from "@/types/chat";
import { useCVDataContext } from "./useCVDataContext";

const STORAGE_KEY = "mistral_chat_messages";

/**
 * Hook to manage MistralAI chat conversation
 */
export const useMistralChat = (config: MistralChatConfig) => {
  const { cvData, updateCVData } = useCVDataContext();
  const [chatState, setChatState] = useState<ChatState>(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    return {
      messages: savedMessages ? JSON.parse(savedMessages) : [],
      isLoading: false,
      error: null,
    };
  });

  const mistralClientRef = useRef<Mistral | null>(null);

  // Initialize Mistral client
  const getMistralClient = useCallback(() => {
    if (!mistralClientRef.current) {
      mistralClientRef.current = new Mistral({
        apiKey: config.apiKey,
      });
    }
    return mistralClientRef.current;
  }, [config.apiKey]);

  // Save messages to localStorage
  const saveMessages = useCallback((messages: ChatMessage[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, []);

  // Add a message to the chat
  const addMessage = useCallback(
    (message: Omit<ChatMessage, "id" | "timestamp">) => {
      const newMessage: ChatMessage = {
        ...message,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };

      setChatState((prev) => {
        const updatedMessages = [...prev.messages, newMessage];
        saveMessages(updatedMessages);
        return {
          ...prev,
          messages: updatedMessages,
        };
      });

      return newMessage;
    },
    [saveMessages]
  );

  // Remove photo URL from CV data to reduce payload size
  const removePhotoFromCVData = useCallback((data: CVData): CVData => {
    return {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        photoUrl: null,
      },
    };
  }, []);

  // Restore photo URL to CV data after receiving response
  const restorePhotoToCVData = useCallback(
    (data: CVData, originalPhotoUrl: string | null): CVData => {
      return {
        ...data,
        personalInfo: {
          ...data.personalInfo,
          photoUrl: originalPhotoUrl,
        },
      };
    },
    []
  );

  // Send a message and get response from Mistral
  const sendMessage = useCallback(
    async (userMessage: string) => {
      try {
        setChatState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Add user message
        addMessage({ role: "user", content: userMessage });

        const client = getMistralClient();
        const originalPhotoUrl = cvData.personalInfo.photoUrl;
        const cvDataWithoutPhoto = removePhotoFromCVData(cvData);

        // Build system prompt
        const systemPrompt = `You are an AI assistant expert in resume creation. You help users improve and modify their resume.

Here is the user's current resume in JSON format:
\`\`\`json
${JSON.stringify(cvDataWithoutPhoto, null, 2)}
\`\`\`

Important instructions:
1. Analyze the user's request and make appropriate modifications to the resume
2. Respond with a JSON containing EXACTLY two fields:
   - "response": a natural conversational message explaining what you did (in English)
   - "cvData": the complete modified resume in JSON format
3. ONLY modify the parts requested by the user in cvData
4. Keep ALL other data unchanged in cvData
5. photoUrl will always be null in cvData (it will be restored automatically)
6. The "response" message should be clear, friendly and explain the modifications made

Response format example:
{
  "response": "I've updated your professional title to 'Full-Stack Developer' and added React to your technical skills.",
  "cvData": { ... the complete modified resume ... }
}`;

        // Call Mistral API with JSON mode
        // Note: Using json_object instead of json_schema because the CV structure
        // is too complex and dynamic for strict schema validation
        const response = await client.chat.complete({
          model: config.model || DEFAULT_MISTRAL_CONFIG.model!,
          temperature: config.temperature || DEFAULT_MISTRAL_CONFIG.temperature,
          maxTokens: config.maxTokens || DEFAULT_MISTRAL_CONFIG.maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          responseFormat: {
            type: "json_object",
          },
        });

        const assistantMessageContent = response.choices?.[0]?.message?.content;

        // Convert content to string if it's an array
        const assistantMessage = Array.isArray(assistantMessageContent)
          ? assistantMessageContent
              .map((chunk) => (typeof chunk === "string" ? chunk : ""))
              .join("")
          : assistantMessageContent || "";

        if (!assistantMessage) {
          throw new Error("No response from Mistral AI");
        }

        // Parse the response to extract the conversational message and CV data
        try {
          const parsedResponse = JSON.parse(assistantMessage) as {
            response: string;
            cvData: CVData;
          };

          if (!parsedResponse.response || !parsedResponse.cvData) {
            throw new Error("Invalid response format from Mistral AI");
          }

          // Restore photo URL in the CV data
          const cvDataWithPhoto = restorePhotoToCVData(
            parsedResponse.cvData,
            originalPhotoUrl
          );

          // Update CV data
          updateCVData(cvDataWithPhoto);

          // Export the updated CV as JSON (with photo) for download
          const cvDataJsonForDownload = JSON.stringify(
            cvDataWithPhoto,
            null,
            2
          );

          // Add assistant message with conversational response
          addMessage({
            role: "assistant",
            content: parsedResponse.response,
            cvDataJson: cvDataJsonForDownload,
          });
        } catch (parseError) {
          console.error("Failed to parse response from Mistral:", parseError);
          addMessage({
            role: "assistant",
            content:
              "Sorry, I encountered an error while applying the modifications. Could you rephrase your request?",
            isError: true,
          });
        }

        setChatState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";

        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        addMessage({
          role: "assistant",
          content: `Error: ${errorMessage}`,
          isError: true,
        });
      }
    },
    [
      config,
      cvData,
      addMessage,
      getMistralClient,
      removePhotoFromCVData,
      restorePhotoToCVData,
      updateCVData,
    ]
  );

  // Clear conversation
  const clearConversation = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages: chatState.messages,
    isLoading: chatState.isLoading,
    error: chatState.error,
    sendMessage,
    clearConversation,
  };
};
