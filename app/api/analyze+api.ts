export async function POST(req: Request): Promise<Response> {
  try {
    const { summary } = await req.json();

    if (!summary) {
      return new Response("Summary is required", { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response("OpenAI API key not configured", { status: 500 });
    }

    const prompt = `Analyze the following financial data summary and provide insights and recommendations in Markdown format:

Data Summary:
- Total rows: ${summary.totalRows}
- Date range: ${
      summary.dateRange
        ? `${summary.dateRange.start} to ${summary.dateRange.end}`
        : "Not available"
    }
- Categories: ${
      summary.categories
        ? Object.keys(summary.categories).join(", ")
        : "Not available"
    }
- Totals: ${
      summary.totals
        ? Object.entries(summary.totals)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "Not available"
    }

Ask: "Identify 3–5 insights, 3 savings opportunities, any recurring-like patterns, and a 30-day action plan. Keep 150–250 words. Return Markdown."`;

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
            content:
              "You are a financial analyst. Identify 3 insights, 3 savings opportunities, any recurring-like patterns, and a 30-day action plan. Keep responses 75-125 words. Return Markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis =
      data.choices?.[0]?.message?.content || "No analysis available";

    return new Response(JSON.stringify({ analysis }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Analysis API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
