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

export async function POST(req: Request): Promise<Response> {
  try {
    const { message, settings, stream: requestStream } = await req.json();

    console.log("Chat API called with message:", message);
    console.log("Settings:", settings);

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    // Get API key from environment or use fallback
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    console.log("API Key exists:", !!apiKey);

    // If no API key, return fallback response
    if (!apiKey) {
      console.log("No API key found, using fallback response");
      
      const fallbackResponse = getFallbackResponse(message, settings);
      
      if (requestStream !== false) {
        return new Response(
          new ReadableStream({
            start(controller) {
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
          }),
          {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
            },
          }
        );
      } else {
        return new Response(JSON.stringify({ content: fallbackResponse }), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Use settings if provided, otherwise default to SAR/en-SA

    const currency = settings?.currency || "SAR";

    const locale = settings?.locale || "en-SA";

    const shouldStream = requestStream !== false; // default to streaming unless explicitly false

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",

            content: `You are a friendly, conservative AI financial coach. Currency is ${currency}, locale ${locale}. Prioritize budgeting, debt reduction, emergency funds, and realistic plans. Consider active goals (name, target, deadline, required per-day/week). Keep answers concise with clear bullets and a short 30-day plan. Avoid personalized investment advice; provide general best practices and disclaim: "Educational purposes, not financial advice."`,
          },

          {
            role: "user",

            content: message,
          },
        ],

        stream: shouldStream,

        temperature: 0.7,

        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("OpenAI API error status:", response.status);
      if (errorText) {
        console.error("OpenAI API error body:", errorText);
      }
      return new Response(
        errorText || `OpenAI API request failed with status ${response.status}`,
        { status: response.status }
      );
    }

    // If the client requested non-streaming, return JSON with the full content
    if (!shouldStream) {
      const json = await response.json();
      const content = json?.choices?.[0]?.message?.content ?? "";
      return Response.json({ content });
    }

    const stream = new ReadableStream({
      start(controller) {
        const reader = response.body?.getReader();

        if (!reader) {
          controller.close();

          return;
        }

        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();

              return;
            }

            const chunk = new TextDecoder().decode(value);

            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);

                if (data === "[DONE]") {
                  controller.close();

                  return;
                }

                try {
                  const parsed = JSON.parse(data);

                  const content = parsed.choices?.[0]?.delta?.content;

                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch (e) {
                  // Ignore parsing errors for incomplete chunks
                }
              }
            }

            return pump();
          });
        }

        pump().catch(() => controller.close());
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",

        "Cache-Control": "no-cache",

        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response("Internal server error", { status: 500 });
  }
}
