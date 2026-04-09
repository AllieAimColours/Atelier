import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { isEmailAllowed } from "@/lib/auth";
import { getAnthropicClient, STUDIO_MODEL } from "@/lib/anthropic";
import type { SlideRecord } from "@/lib/types";

// ─── system prompt: the soul of the co-pilot ──────────────────────────────
const SYSTEM_PROMPT = `You are the AI co-pilot inside The Atelier — the private workshop of Allie Huerta, founder of Aim Colours, who is raising $1.3M to bring colour-changing electronic film to luxury maisons (Chanel, Hermès, LVMH, Cartier).

You help Allie iterate on a 12-slide investor pitch deck. The audience is sophisticated: VC partners and luxury house executives. The bar is luxury-grade.

═══════════════════════════════════════════════════════════════════════
BRAND VOICE — SACRED. DO NOT VIOLATE.
═══════════════════════════════════════════════════════════════════════

• Restraint over abundance. Cut more than you add.
• Poetic, but precise. Example: "The object that changes. The relationship that doesn't."
• Confident, never desperate. Never "we hope" or "we believe" — say it.
• French sensibility. Cormorant Garamond, gold, ivory, dark.
• Italics for emphasis, never exclamation marks.
• Never use marketing jargon, buzzwords, "synergy", "disruptive", "best-in-class", "leverage", "ecosystem", "solution".
• Specifics > generalities. "400 colours, sold per maison" beats "many colours, customizable."
• Em-dashes (—) are welcome. Hyphens (-) are not interchangeable.
• Use "maison" not "luxury brand". Use "atelier" not "workshop". Use "house" not "company".

═══════════════════════════════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════════════════════════════

When Allie asks you to edit a slide:
1. Use the propose_slide_update tool to suggest a structured change.
2. The "content" field MUST match the current slide's JSONB schema exactly — same keys, same nesting, same types. Only the values change.
3. The "summary" should be one short sentence describing what you changed and why.
4. If she asks for advice without an edit, just respond in plain text — don't call the tool unnecessarily.
5. If she asks something you can't do (e.g., edit a different slide than the current one), say so plainly.

Your job is to be a thoughtful editor with strong taste, not a yes-machine. If she asks for something that would weaken the deck, push back briefly and offer a better alternative.`;

// ─── tool definition: the only thing the co-pilot can DO ───────────────
const TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: "propose_slide_update",
    description:
      "Proposes an update to the current slide's content. The user will see a diff and accept or reject before it's applied. The new content MUST preserve the existing JSONB schema (same keys, same structure) — only edit the values.",
    input_schema: {
      type: "object",
      properties: {
        content: {
          type: "object",
          description:
            "The full new content JSON for the slide. Must match the slide type's schema exactly — same keys, same nesting.",
        },
        summary: {
          type: "string",
          description:
            "A single concise sentence describing what changed and why (e.g. 'Tightened the founder bio by removing redundant phrasing').",
        },
      },
      required: ["content", "summary"],
    },
  },
];

import type Anthropic from "@anthropic-ai/sdk";

type ChatRequest = {
  slide: SlideRecord;
  messages: { role: "user" | "assistant"; content: string }[];
};

type ChatResponse =
  | {
      ok: true;
      text: string;
      proposal: { content: unknown; summary: string } | null;
    }
  | { ok: false; error: string };

// ─── POST /api/chat ────────────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
  // ─── auth ───
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isEmailAllowed(user.email)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // ─── parse body ───
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.slide || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Missing slide or messages" },
      { status: 400 }
    );
  }

  // ─── build the request ───
  const slideContext = `═══ CURRENT SLIDE ═══
Position: ${body.slide.position} of 12
Type: ${body.slide.type}
Title: ${body.slide.title ?? "(untitled)"}

Current content (the schema you must preserve):
\`\`\`json
${JSON.stringify(body.slide.content, null, 2)}
\`\`\``;

  const conversationMessages: Anthropic.Messages.MessageParam[] = [
    // First message: ground Claude in the current slide
    { role: "user", content: slideContext },
    {
      role: "assistant",
      content:
        "Understood. I have the current slide context and will preserve its schema in any proposed updates. Ready to help.",
    },
    // Then the actual conversation
    ...body.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  // ─── call Claude ───
  let response;
  try {
    const anthropic = getAnthropicClient();
    response = await anthropic.messages.create({
      model: STUDIO_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages: conversationMessages,
    });
  } catch (e) {
    console.error("[/api/chat] anthropic error", e);
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Anthropic API error",
      },
      { status: 500 }
    );
  }

  // ─── parse response: text + optional tool_use ───
  let text = "";
  let proposal: { content: unknown; summary: string } | null = null;

  for (const block of response.content) {
    if (block.type === "text") {
      text += block.text;
    } else if (block.type === "tool_use" && block.name === "propose_slide_update") {
      const input = block.input as { content?: unknown; summary?: string };
      if (input.content && typeof input.summary === "string") {
        proposal = { content: input.content, summary: input.summary };
      }
    }
  }

  return NextResponse.json({ ok: true, text, proposal });
}
