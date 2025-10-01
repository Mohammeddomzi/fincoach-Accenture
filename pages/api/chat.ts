export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, settings, stream: requestStream } = req.body;

    console.log("Chat API called with message:", message);
    console.log("Settings:", settings);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    console.log("API Key exists:", !!apiKey);

    if (!apiKey) {
      console.error("OpenAI API key not configured");
      return res.status(500).json({ error: 'OpenAI API key not configured' });
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
      return res.status(response.status).json({
        error: errorText || `OpenAI API request failed with status ${response.status}`,
      });
    }

    // If the client requested non-streaming, return JSON with the full content
    if (!shouldStream) {
      const json = await response.json();
      const content = json?.choices?.[0]?.message?.content ?? "";
      return res.json({ content });
    }

    // Set up streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body?.getReader();
    if (!reader) {
      return res.end();
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              return res.end();
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                res.write(content);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    res.end();
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
