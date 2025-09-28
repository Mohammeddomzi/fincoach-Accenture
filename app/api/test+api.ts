export async function GET(): Promise<Response> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    return new Response(
      JSON.stringify({
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey ? apiKey.length : 0,
        envVars: Object.keys(process.env).filter((key) =>
          key.includes("OPENAI")
        ),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Test API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

