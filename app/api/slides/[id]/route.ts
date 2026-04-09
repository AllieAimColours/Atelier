import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { isEmailAllowed } from "@/lib/auth";

// PATCH /api/slides/[id]
// Body: { content: SlideContent }
// Updates a slide's JSONB content. Auth required + email allowlist enforced.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  // ─── auth check ───
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isEmailAllowed(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ─── parse body ───
  let body: { content?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof body.content !== "object" || body.content === null) {
    return NextResponse.json(
      { error: "Body must contain a 'content' object" },
      { status: 400 }
    );
  }

  // ─── update ───
  const { data: slide, error } = await supabase
    .from("slides")
    .update({ content: body.content })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[PATCH /api/slides/:id]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slide });
}
