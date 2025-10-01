export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ error: 'Summary is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OpenAI API key not configured");
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

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
            content: "You are a financial analysis AI. Analyze the provided financial data and provide insights, recommendations, and trends. Be concise and actionable.",
          },
          {
            role: "user",
            content: `Please analyze this financial data: ${JSON.stringify(summary)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("OpenAI API error status:", response.status);
      return res.status(response.status).json({
        error: errorText || `OpenAI API request failed with status ${response.status}`,
      });
    }

    const json = await response.json();
    const analysis = json?.choices?.[0]?.message?.content ?? "";

    return res.json({ analysis });
  } catch (error) {
    console.error("Analyze API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
