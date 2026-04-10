import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { isEmailAllowed } from "@/lib/auth";

// PATCH /api/slides/[id]
// Body: { content?: SlideContent, title?: string, position?: number, type?: string }
// Updates fields on a slide. Any subset is allowed.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isEmailAllowed(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    content?: unknown;
    title?: string;
    position?: number;
    type?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (body.content !== undefined) {
    if (typeof body.content !== "object" || body.content === null) {
      return NextResponse.json(
        { error: "'content' must be an object" },
        { status: 400 }
      );
    }
    update.content = body.content;
  }
  if (body.title !== undefined) update.title = body.title;
  if (body.position !== undefined) update.position = body.position;
  if (body.type !== undefined) update.type = body.type;

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No updatable fields supplied" },
      { status: 400 }
    );
  }

  const { data: slide, error } = await supabase
    .from("slides")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[PATCH /api/slides/:id]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slide });
}

// DELETE /api/slides/[id]
// Removes a slide and shifts subsequent positions down by 1.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isEmailAllowed(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look up the slide first so we know its deck_id and position
  const { data: target, error: lookupErr } = await supabase
    .from("slides")
    .select("id, deck_id, position")
    .eq("id", id)
    .maybeSingle();
  if (lookupErr || !target) {
    return NextResponse.json(
      { error: lookupErr?.message ?? "Slide not found" },
      { status: 404 }
    );
  }

  // Delete the slide
  const { error: delErr } = await supabase.from("slides").delete().eq("id", id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  // Shift all subsequent slides up by 1 (in ascending order so we don't
  // create unique-constraint conflicts on (deck_id, position))
  const { data: toShift } = await supabase
    .from("slides")
    .select("id, position")
    .eq("deck_id", target.deck_id)
    .gt("position", target.position)
    .order("position", { ascending: true });

  for (const s of toShift ?? []) {
    await supabase
      .from("slides")
      .update({ position: s.position - 1 })
      .eq("id", s.id);
  }

  return NextResponse.json({ ok: true });
}
