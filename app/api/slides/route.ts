import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { isEmailAllowed } from "@/lib/auth";
import type { SlideType } from "@/lib/types";

// POST /api/slides
// Body: { deck_id, position, type, title, content }
// Inserts a new slide. Auth-gated. The caller is responsible for ensuring
// `position` is unique within the deck — the recommended pattern is to
// reorder all slides on the client first, then insert at the desired index.
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isEmailAllowed(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    deck_id?: string;
    position?: number;
    type?: SlideType;
    title?: string | null;
    content?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body.deck_id ||
    typeof body.position !== "number" ||
    !body.type ||
    typeof body.content !== "object" ||
    body.content === null
  ) {
    return NextResponse.json(
      { error: "Missing required fields: deck_id, position, type, content" },
      { status: 400 }
    );
  }

  // Shift down all slides at >= position so the new slide can take it
  // (Postgres ON CONFLICT handling: easier to do this in SQL)
  const { error: shiftErr } = await supabase.rpc("shift_slides_down", {
    p_deck_id: body.deck_id,
    p_from_position: body.position,
  });
  // If the RPC doesn't exist yet, fall back to manual shift below
  if (shiftErr && shiftErr.code !== "PGRST202") {
    // Manual shift via two-step (UPDATE all higher positions by +1)
    // We do this by selecting then updating one at a time, in reverse order
    // to avoid unique constraint conflicts.
    const { data: toShift, error: selErr } = await supabase
      .from("slides")
      .select("id, position")
      .eq("deck_id", body.deck_id)
      .gte("position", body.position)
      .order("position", { ascending: false });
    if (selErr) {
      return NextResponse.json({ error: selErr.message }, { status: 500 });
    }
    for (const s of toShift ?? []) {
      const { error: upErr } = await supabase
        .from("slides")
        .update({ position: s.position + 1 })
        .eq("id", s.id);
      if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }
    }
  }

  const { data: slide, error } = await supabase
    .from("slides")
    .insert({
      deck_id: body.deck_id,
      position: body.position,
      type: body.type,
      title: body.title ?? null,
      content: body.content,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[POST /api/slides]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slide });
}
