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
      // Use non-streaming API on device, then simulate streaming locally
      const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
      console.log("Expo Go base URL:", baseUrl);
      if (!baseUrl) {
        console.warn(
          "EXPO_PUBLIC_API_BASE_URL not set; using brief notice on device"
        );
        return new ReadableStream({
          start(controller) {
            const text =
              "Backend URL not configured. Set EXPO_PUBLIC_API_BASE_URL to your dev server URL.";
            let i = 0;
            const interval = setInterval(() => {
              if (i < text.length) {
                controller.enqueue(new TextEncoder().encode(text[i]));
                i++;
              } else {
                clearInterval(interval);
                controller.close();
              }
            }, 20);
          },
        });
      }

      const url = `${baseUrl.replace(/\/$/, "")}/api/chat`;
      console.log("Calling mobile chat endpoint:", url);
      let full = "";
      try {
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, settings, stream: false }),
        });

        console.log("Mobile chat response status:", resp.status);
        if (!resp.ok) {
          const errText = await resp.text().catch(() => "");
          throw new Error(
            `Mobile chat request failed: ${resp.status} ${errText}`
          );
        }

        const data = await resp.json();
        full = data?.content ?? "";
      } catch (mobileErr) {
        console.warn(
          "Mobile backend call failed, trying direct OpenAI:",
          mobileErr
        );
        const publicKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
        if (!publicKey) {
          throw mobileErr;
        }
        // Direct, non-streaming OpenAI call as a fallback for device
        const currency = settings?.currency || "SAR";
        const locale = settings?.locale || "en-SA";
        const system = `You are a friendly, conservative AI financial coach. Currency is ${currency}, locale ${locale}. Prioritize budgeting, debt reduction, emergency funds, and realistic plans. Consider active goals (name, target, deadline, required per-day/week). Keep answers concise with clear bullets and a short 30-day plan. Avoid personalized investment advice; provide general best practices and disclaim: "Educational purposes, not financial advice."`;
        const openaiResp = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: system },
                { role: "user", content: message },
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          }
        );
        if (!openaiResp.ok) {
          const errText = await openaiResp.text().catch(() => "");
          throw new Error(
            `Direct OpenAI failed: ${openaiResp.status} ${errText}`
          );
        }
        const json = await openaiResp.json();
        full = json?.choices?.[0]?.message?.content ?? "";
      }

      return new ReadableStream({
        start(controller) {
          let i = 0;
          const interval = setInterval(() => {
            if (i < full.length) {
              controller.enqueue(new TextEncoder().encode(full[i]));
              i++;
            } else {
              clearInterval(interval);
              controller.close();
            }
          }, 15);
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
      body: JSON.stringify({ message, settings, stream: true }),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Response error:", errorText);
      // Return a streamed fallback containing the error text so UI doesn't show generic error
      return new ReadableStream({
        start(controller) {
          const text =
            `I apologize, but I couldn't complete your request.\n\n` +
            (errorText ? `Error from server: ${errorText}\n\n` : "") +
            `Please try again in a moment.`;
          let i = 0;
          const interval = setInterval(() => {
            if (i < text.length) {
              controller.enqueue(new TextEncoder().encode(text[i]));
              i++;
            } else {
              clearInterval(interval);
              controller.close();
            }
          }, 20);
        },
      });
    }

    console.log("Response body exists:", !!response.body);
    return response.body;
  } catch (error) {
    console.error("Error sending chat message:", error);

    // Fallback: return a mock response if API fails
    console.log("Falling back to mock response due to error");
    return new ReadableStream({
      start(controller) {
        const fallbackResponse = `I apologize, but I'm having trouble connecting right now.\n\nError: ${String(
          error
        )}\n\nHere are some general financial tips:

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
