export const askOpenRouter = async (prompt) => {
  const API_KEY = (process.env.OPENROUTER_API_KEY || "").trim();
  const MODEL = (process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash").trim();

  if (!API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not defined in environment variables.");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Hostel Management System",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("No response content returned from OpenRouter.");
    }
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
};
