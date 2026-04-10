-- ═══════════════════════════════════════════════════════════════════════
-- THE ATELIER · 0004 · SYNC TONIGHT'S CONTENT
-- ═══════════════════════════════════════════════════════════════════════
-- Brings the Atelier master deck up to date with the changes shipped to
-- PitchDeck/index.html on the night of the Startup Grind investor send:
--
--   1. S1 Cover — adds demo CTA + video URL fields
--   2. S12 Close — replaces the "applying to La Maison des Startups" framing
--      with the structured Pre-Seed Ask: $1.3M, use of funds, milestones
-- ═══════════════════════════════════════════════════════════════════════

-- ─── S1 COVER · add demo CTA + video URL ──────────────────────────────────
update public.slides
set content = content || $json${
  "demo_cta_label": "▶ Watch the demo",
  "demo_video_url": "https://player.vimeo.com/video/1128053515?autoplay=1&title=0&byline=0&portrait=0&dnt=1"
}$json$::jsonb
where deck_id = (select id from public.decks where slug = 'default')
  and type = 'cover';

-- ─── S12 CLOSE · structured Pre-Seed Ask ──────────────────────────────────
update public.slides
set content = jsonb_set(
  content,
  '{right}',
  $json${
    "label": "The Ask",
    "amount": "$1.3M",
    "raise_meta": "Pre-Seed · 18-month runway",
    "use_of_funds": [
      { "label": "Team & key hires",         "pct": "37%" },
      { "label": "R&D & manufacturing",      "pct": "22%" },
      { "label": "IP, patent & legal",       "pct": "15%" },
      { "label": "Operations",               "pct": "15%" },
      { "label": "Marketing & commercial",   "pct": "11%" }
    ],
    "unlocks_label": "What this unlocks",
    "unlocks_body": "First maison contract signed · first production run · WIPO patent filed · core team to ten.",
    "footer_lines": [
      "The maison that moves first",
      "owns the category."
    ]
  }$json$::jsonb
)
where deck_id = (select id from public.decks where slug = 'default')
  and type = 'close';
