import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function streamSummary(prompt: string, onToken: (chunk: string) => void) {
  if (!client) {
    onToken("OPENAI_API_KEY is not configured. Returning deterministic fallback summary.");
    return;
  }

  const stream = await client.responses.stream({
    model: "gpt-4.1-mini",
    input: prompt
  });

  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      onToken(event.delta);
    }
  }
}
