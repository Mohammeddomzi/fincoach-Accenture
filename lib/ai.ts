import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatMessage } from "../types";
import { isExpoGo } from "./platform";

// Fallback response function for when API is unavailable
function getFallbackResponse(message: string, settings?: any): string {
  const currency = settings?.currency || 'SAR';
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
    return `Here's a simple budgeting approach for ${currency}:

• **50/30/20 Rule**: 50% needs, 30% wants, 20% savings
• **Track expenses** for 30 days to understand spending patterns
• **Set monthly limits** for each category
• **Use apps** to monitor transactions automatically

**30-Day Plan:**
1. Week 1: Track all expenses
2. Week 2: Categorize spending
3. Week 3: Set realistic limits
4. Week 4: Adjust and optimize

*Educational purposes, not financial advice.*`;
  }
  
  if (lowerMessage.includes('save') || lowerMessage.includes('emergency')) {
    return `Emergency fund strategy for ${currency}:

• **Start small**: Aim for 1,000 ${currency} initially
• **Build gradually**: Target 3-6 months of expenses
• **High-yield savings**: Keep in accessible account
• **Automate transfers**: Set up monthly contributions

**30-Day Plan:**
1. Calculate monthly expenses
2. Open dedicated savings account
3. Set up automatic transfers
4. Track progress weekly

*Educational purposes, not financial advice.*`;
  }
  
  if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) {
    return `Debt reduction strategy for ${currency}:

• **List all debts**: Amounts, interest rates, minimum payments
• **Choose method**: Snowball (smallest first) or Avalanche (highest interest)
• **Pay more than minimum**: Even 50 ${currency} extra helps
• **Avoid new debt**: Pause non-essential spending

**30-Day Plan:**
1. Create debt inventory
2. Choose payoff strategy
3. Increase payments where possible
4. Monitor progress monthly

*Educational purposes, not financial advice.*`;
  }
  
  if (lowerMessage.includes('invest') || lowerMessage.includes('stock')) {
    return `Investment basics for ${currency}:

• **Start with education**: Learn before investing
• **Diversify**: Don't put all money in one place
• **Long-term focus**: Think 5+ years
• **Consider index funds**: Lower risk, steady growth

**30-Day Plan:**
1. Research investment options
2. Start with small amounts
3. Use dollar-cost averaging
4. Review quarterly

*Educational purposes, not financial advice.*`;
  }
  
  if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
    return `Goal setting for ${currency}:

• **SMART goals**: Specific, Measurable, Achievable, Relevant, Time-bound
• **Break down large goals**: Monthly/weekly targets
• **Track progress**: Regular check-ins
• **Celebrate milestones**: Stay motivated

**30-Day Plan:**
1. Define your financial goals
2. Set specific amounts and deadlines
3. Create action plan
4. Start taking steps

*Educational purposes, not financial advice.*`;
  }
  
  // Default response
  return `I'm here to help with your financial questions! I can assist with:

• **Budgeting** and expense tracking
• **Emergency fund** planning
• **Debt reduction** strategies
• **Investment** basics
• **Goal setting** and planning

Please ask me about any of these topics, and I'll provide practical advice in ${currency}.

*Educational purposes, not financial advice.*`;
}

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
          "EXPO_PUBLIC_API_BASE_URL not set; using fallback responses"
        );
        return new ReadableStream({
          start(controller) {
            const fallbackResponse = getFallbackResponse(message, settings);
            let i = 0;
            const interval = setInterval(() => {
              if (i < fallbackResponse.length) {
                controller.enqueue(new TextEncoder().encode(fallbackResponse[i]));
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

    // Web version - try API first, fallback if it fails
    console.log("Using web API with fallback");
    
    try {
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
        throw new Error(`API error: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.log("API failed, using fallback response:", error);
      return new ReadableStream({
        start(controller) {
          const fallbackResponse = getFallbackResponse(message, settings);
          let i = 0;
          const interval = setInterval(() => {
            if (i < fallbackResponse.length) {
              controller.enqueue(new TextEncoder().encode(fallbackResponse[i]));
              i++;
            } else {
              clearInterval(interval);
              controller.close();
            }
          }, 20);
        },
      });
    }
  } catch (error) {
    console.error("Error sending chat message:", error);

    // Fallback: return intelligent response if API fails
    console.log("Falling back to intelligent response due to error");
    return new ReadableStream({
      start(controller) {
        const fallbackResponse = getFallbackResponse(message, settings);
        let i = 0;
        const interval = setInterval(() => {
          if (i < fallbackResponse.length) {
            controller.enqueue(new TextEncoder().encode(fallbackResponse[i]));
            i++;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 20);
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
