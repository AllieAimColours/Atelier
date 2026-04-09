// ═══════════════════════════════════════════════════════════════════════
// THE ATELIER · DECK DATA FETCHER
// ═══════════════════════════════════════════════════════════════════════
// Server-side fetcher used by the public renderer at /pitch/[slug].
// Reads only published decks (RLS enforces this even with the anon key).
// ═══════════════════════════════════════════════════════════════════════

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Audience,
  Deck,
  DeckBundle,
  SlideRecord,
  Theme,
} from "./types";

function publicServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

// Internal helper — works with any client (anon for public, ssr for studio)
async function fetchDeckBundle(
  supabase: SupabaseClient,
  slug: string
): Promise<DeckBundle | null> {

  // 1. fetch the deck (RLS lets through only published)
  const { data: deck, error: deckErr } = await supabase
    .from("decks")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (deckErr) {
    console.error("[getDeckBySlug] deck error", deckErr);
    return null;
  }
  if (!deck) return null;

  // 2. parallel fetches for slides, theme, audience
  const [slidesRes, themeRes, audienceRes] = await Promise.all([
    supabase
      .from("slides")
      .select("*")
      .eq("deck_id", deck.id)
      .order("position", { ascending: true }),
    deck.theme_id
      ? supabase.from("themes").select("*").eq("id", deck.theme_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    deck.audience_id
      ? supabase
          .from("audiences")
          .select("*")
          .eq("id", deck.audience_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (slidesRes.error) {
    console.error("[getDeckBySlug] slides error", slidesRes.error);
    return null;
  }

  return {
    deck: deck as Deck,
    theme: (themeRes.data ?? null) as Theme | null,
    audience: (audienceRes.data ?? null) as Audience | null,
    slides: (slidesRes.data ?? []) as SlideRecord[],
  };
}

// Public-facing fetch — only published decks via RLS
export async function getDeckBySlug(slug: string): Promise<DeckBundle | null> {
  return fetchDeckBundle(publicServerClient(), slug);
}

// Studio fetch — pass an authenticated client to see drafts too
export async function getDeckBySlugAuthed(
  supabase: SupabaseClient,
  slug: string
): Promise<DeckBundle | null> {
  return fetchDeckBundle(supabase, slug);
}
