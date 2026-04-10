// ═══════════════════════════════════════════════════════════════════════
// THE ATELIER · TYPES
// ═══════════════════════════════════════════════════════════════════════
// Mirrors the schemas in supabase/migrations/0001_initial_schema.sql
// Slide content shapes match the JSONB stored per slide type.
// ═══════════════════════════════════════════════════════════════════════

export type ThemeTokens = {
  colors: {
    bg: string;
    ivory: string;
    ivory_dim: string;
    gold: string;
    gold_dim: string;
    gold_line: string;
  };
  fonts: {
    serif: string;
    sans: string;
  };
};

export type Theme = {
  id: string;
  slug: string;
  name: string;
  tokens: ThemeTokens;
  is_default: boolean;
};

export type Audience = {
  id: string;
  slug: string;
  name: string;
  type: "vc" | "maison" | "accelerator" | "strategic" | "public";
  logo_url: string | null;
  primary_color: string | null;
  notes: string | null;
};

export type DeckStatus = "draft" | "published" | "archived";

export type Deck = {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  audience_id: string | null;
  theme_id: string | null;
  status: DeckStatus;
};

export type SlideType =
  | "cover"
  | "problem"
  | "vision"
  | "technology"
  | "experience"
  | "revenue"
  | "gtm"
  | "traction"
  | "market"
  | "roadmap"
  | "team"
  | "close";

export type SlideRecord = {
  id: string;
  deck_id: string;
  position: number;
  type: SlideType;
  title: string | null;
  content: SlideContent;
};

// ─── per-slide content shapes ─────────────────────────────────────────────

export type CoverContent = {
  title_top: string;
  title_bottom: string;
  patent: string;
  footer_left: string;
  footer_right: string;
  // Optional video CTA (added in tonight's sync). When present, the cover
  // shows a "Watch the demo" button below the title that opens a fullscreen
  // video lightbox over the deck.
  demo_cta_label?: string;
  demo_video_url?: string;
};

export type ProblemContent = {
  label: string;
  headline_lead: string;
  headline_accent: string;
  two_columns: { title: string; body: string }[];
  transition: string;
  pull_quote: string;
};

export type VisionContent = {
  label: string;
  headline_lead: string;
  headline_accent: string;
  image: {
    src: string;
    alt: string;
    caption: string;
    background: string;
  };
  three_columns: { title: string; body: string }[];
};

export type TechnologyContent = {
  label: string;
  headline_lead: string;
  headline_accent: string;
  image?: { src: string; alt: string; note?: string };
  body: string;
  specs: { value: string; label: string }[];
  patent: string;
};

export type ExperienceContent = {
  label: string;
  headline_lead: string;
  headline_accent: string;
  numbered_columns: { number: string; title: string; body: string }[];
};

export type RevenueContent = {
  label: string;
  headline_lead: string;
  headline_accent: string;
  pillars: { number: string; title: string; body: string; stat: string }[];
};

export type GtmContent = {
  label: string;
  headline_lead: string;
  headline_accent: string;
  years: { label: string; title: string; body: string; highlight?: boolean }[];
};

export type TractionContent = {
  label: string;
  big_statement_lead: string;
  big_statement_accent: string;
  footnote: string;
};

export type MarketContent = {
  label: string;
  metrics: { label: string; value: string; desc: string }[];
  statement: { lead: string; mid: string; accent: string };
  right: {
    label: string;
    headline: string;
    moat: { title: string; body: string }[];
  };
};

export type RoadmapContent = {
  label: string;
  headline_lead: string;
  headline_accent: string;
  phases: { label: string; title: string; body: string }[];
  beyond: { label: string; phase: string; body: string };
};

export type TeamContent = {
  label: string;
  members: {
    name: string;
    url: string;
    role: string;
    bio: string;
    badge?: string;
    is_advisor?: boolean;
  }[];
  partners: { label: string; desc: string }[];
};

export type CloseContent = {
  left: {
    label: string;
    statement_lines: string[];
    statement_accent_lines: string[];
    links: { type: "email" | "url" | "cta"; value: string; href?: string }[];
  };
  right: {
    label: string;
    amount: string;          // e.g. "$1.3M"
    raise_meta: string;      // e.g. "Pre-Seed · 18-month runway"
    use_of_funds: { label: string; pct: string }[];
    unlocks_label: string;   // e.g. "What this unlocks"
    unlocks_body: string;    // milestones sentence
    footer_lines: string[];
  };
};

export type SlideContent =
  | CoverContent
  | ProblemContent
  | VisionContent
  | TechnologyContent
  | ExperienceContent
  | RevenueContent
  | GtmContent
  | TractionContent
  | MarketContent
  | RoadmapContent
  | TeamContent
  | CloseContent;

// ─── full deck bundle returned by the data fetcher ────────────────────────
export type DeckBundle = {
  deck: Deck;
  theme: Theme | null;
  audience: Audience | null;
  slides: SlideRecord[];
};
