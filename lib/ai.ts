import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatMessage } from "../types";
import { isExpoGo } from "./platform";

export const sendChatMessage = async (
  message: string,
  settings?: any
): Promise<ReadableStream<Uint8Array> | null> => {
  try {
    console.log("sendChatMessage called with:", { message, settings });

    // Better mobile detection for Expo Go
    const isMobile = isExpoGo();

    console.log("Is Mobile/Expo Go:", isMobile);
    console.log(
      "Platform detection:",
      typeof window !== "undefined" ? window.location.protocol : "React Native"
    );

    if (isMobile) {
      console.log("Running in Expo Go - using mock response");
      // Create a mock streaming response for mobile testing
      return new ReadableStream({
        start(controller) {
          const mockResponse = `Hello! I'm your AI financial advisor. I received your message: "${message}". 

Here are some general financial tips:
• Build an emergency fund (3-6 months expenses)
• Pay off high-interest debt first
• Start investing early for compound growth
• Track your spending monthly
• Set realistic financial goals

Remember: This is educational content, not professional financial advice.`;

          let index = 0;
          const interval = setInterval(() => {
            if (index < mockResponse.length) {
              controller.enqueue(new TextEncoder().encode(mockResponse[index]));
              index++;
            } else {
              clearInterval(interval);
              controller.close();
            }
          }, 30); // 30ms delay between characters for realistic streaming
        },
      });
    }

    // Web version - use actual API
    console.log("Using web API");
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, settings }),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Response body exists:", !!response.body);
    return response.body;
  } catch (error) {
    console.error("Error sending chat message:", error);

    // Fallback: return a mock response if API fails
    console.log("Falling back to mock response due to error");
    return new ReadableStream({
      start(controller) {
        const fallbackResponse = `I apologize, but I'm having trouble connecting right now. Here are some general financial tips:

• Build an emergency fund (3-6 months of expenses)
• Pay off high-interest debt first
• Start investing early for compound growth
• Track your spending monthly
• Set realistic financial goals

Please try again later. This is educational content, not professional financial advice.`;

        let index = 0;
        const interval = setInterval(() => {
          if (index < fallbackResponse.length) {
            controller.enqueue(
              new TextEncoder().encode(fallbackResponse[index])
            );
            index++;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 30);
      },
    });
  }
};

export const analyzeCSV = async (summary: any): Promise<string | null> => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ summary }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error("Error analyzing CSV:", error);
    return null;
  }
};

export const STORAGE_KEYS = {
  CHAT_MESSAGES: "chat_messages",
  GOALS: "goals",
  SETTINGS: "settings",
} as const;

export const saveChatMessages = async (
  messages: ChatMessage[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CHAT_MESSAGES,
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error("Error saving chat messages:", error);
  }
};

export const loadChatMessages = async (): Promise<ChatMessage[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (stored) {
      const messages = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
    return [];
  } catch (error) {
    console.error("Error loading chat messages:", error);
    return [];
  }
};

export const saveGoals = async (goals: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error("Error saving goals:", error);
  }
};

export const loadGoals = async (): Promise<any[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
    if (stored) {
      const goals = JSON.parse(stored);
      // Convert date strings back to Date objects
      return goals.map((goal: any) => ({
        ...goal,
        deadline: new Date(goal.deadline),
        createdAt: new Date(goal.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.error("Error loading goals:", error);
    return [];
  }
};

export const saveSettings = async (settings: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

export const loadSettings = async (): Promise<any> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      currency: "SAR",
      theme: "dark",
      locale: "en-SA",
      companyMode: false,
      companyBrand: {
        name: "",
        primary: "#2d5b67",
        secondary: "#4f7f8c",
        accent: "#b9dae9",
        logoPath: "",
      },
    };
  } catch (error) {
    console.error("Error loading settings:", error);
    return {
      currency: "SAR",
      theme: "dark",
      locale: "en-SA",
      companyMode: false,
      companyBrand: {
        name: "",
        primary: "#2d5b67",
        secondary: "#4f7f8c",
        accent: "#b9dae9",
        logoPath: "",
      },
    };
  }
};
