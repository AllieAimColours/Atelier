import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey });
}

// Default model for the Studio co-pilot.
// Using Sonnet 4.6 — fast enough for chat, smart enough for nuanced editing.
export const STUDIO_MODEL = "claude-sonnet-4-6";
