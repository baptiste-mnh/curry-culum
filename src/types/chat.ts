export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isError?: boolean;
  cvDataJson?: string; // Optional: stores the full CV JSON for download
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface MistralChatConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const DEFAULT_MISTRAL_CONFIG: Omit<MistralChatConfig, "apiKey"> = {
  model: "mistral-small-latest",
  temperature: 0.2,
  maxTokens: 4096,
};
