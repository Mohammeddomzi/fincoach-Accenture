export async function POST(req: Request): Promise<Response> {
  try {
    const { message, settings } = await req.json();

    console.log("Chat API called with message:", message);
    console.log("Settings:", settings);

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    console.log("API Key exists:", !!apiKey);

    // Use settings if provided, otherwise default to SAR/en-SA
    const currency = settings?.currency || "SAR";
    const locale = settings?.locale || "en-SA";

    if (!apiKey) {
      // Stream a mock response so the UI keeps working in development/demo
      const mock = new ReadableStream({
        start(controller) {
          const text = `Hi! I'm your financial coach. I received: "${message}".\n\nHere are some quick ideas to try today:\n- Set a SAR 1,000 emergency fund target\n- Track this week's top 3 expenses\n- Move 10% of income to savings on payday\n\nSay 'create a savings plan' to get a 30‑day checklist.`;
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
      return new Response(mock, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
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
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status);
      // Fall back to a friendly streaming mock
      const fallback = new ReadableStream({
        start(controller) {
          const text = `I'm having trouble with the AI service right now. Meanwhile, try one of these:\n- Upload a CSV to analyze spending\n- Set a goal with deadline and target\n- Ask for a 6‑month savings forecast`;
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
      return new Response(fallback, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
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
