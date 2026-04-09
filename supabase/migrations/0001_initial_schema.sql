-- ═══════════════════════════════════════════════════════════════════════
-- THE ATELIER · 0001 · INITIAL SCHEMA
-- ═══════════════════════════════════════════════════════════════════════
-- Tables:
--   themes      — design tokens (colors, fonts) for default + per-variant overrides
--   audiences   — who you're pitching to (Sequoia, Chanel, La Maison des Startups…)
--   decks       — a deck variant (default + one per audience)
--   slides      — individual slides in a deck (content as JSONB)
--   media       — uploaded images, gifs, videos (Supabase Storage refs)
--
-- Convention: every table has id (uuid), created_at, updated_at.
-- updated_at is maintained by a trigger.
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─── helper: auto-update updated_at ───────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── themes ───────────────────────────────────────────────────────────────
create table public.themes (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  tokens      jsonb not null default '{}'::jsonb,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger themes_updated_at
  before update on public.themes
  for each row execute function public.set_updated_at();

-- Only one default theme at a time
create unique index themes_one_default
  on public.themes ((is_default))
  where is_default = true;

-- ─── audiences ────────────────────────────────────────────────────────────
create table public.audiences (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  type          text not null check (type in ('vc', 'maison', 'accelerator', 'strategic', 'public')),
  logo_url      text,
  primary_color text,  -- optional override for theme accent
  notes         text,  -- private notes (your context, not shown to audience)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger audiences_updated_at
  before update on public.audiences
  for each row execute function public.set_updated_at();

-- ─── decks ────────────────────────────────────────────────────────────────
create table public.decks (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  parent_id    uuid references public.decks(id) on delete set null,
  audience_id  uuid references public.audiences(id) on delete set null,
  theme_id     uuid references public.themes(id) on delete set null,
  status       text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger decks_updated_at
  before update on public.decks
  for each row execute function public.set_updated_at();

create index decks_audience_idx on public.decks(audience_id);
create index decks_status_idx on public.decks(status);

-- ─── slides ───────────────────────────────────────────────────────────────
create table public.slides (
  id          uuid primary key default gen_random_uuid(),
  deck_id     uuid not null references public.decks(id) on delete cascade,
  position    int not null,
  type        text not null,
  title       text,
  content     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (deck_id, position)
);

create trigger slides_updated_at
  before update on public.slides
  for each row execute function public.set_updated_at();

create index slides_deck_idx on public.slides(deck_id);

-- ─── media ────────────────────────────────────────────────────────────────
create table public.media (
  id            uuid primary key default gen_random_uuid(),
  deck_id       uuid references public.decks(id) on delete cascade, -- null = global
  kind          text not null check (kind in ('image', 'gif', 'video', 'svg')),
  storage_path  text not null,
  public_url    text not null,
  alt_text      text,
  width         int,
  height        int,
  created_at    timestamptz not null default now()
);

create index media_deck_idx on public.media(deck_id);

-- ═══════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════
-- Public can READ published decks and their slides + theme + audience + media.
-- All writes require service_role (we'll add Supabase Auth in Phase 2).

alter table public.themes      enable row level security;
alter table public.audiences   enable row level security;
alter table public.decks       enable row level security;
alter table public.slides      enable row level security;
alter table public.media       enable row level security;

-- themes: anyone can read
create policy "themes are public"
  on public.themes for select
  using (true);

-- audiences: anyone can read (logo + name shown on personalized cover)
create policy "audiences are public"
  on public.audiences for select
  using (true);

-- decks: only published are publicly readable
create policy "published decks are public"
  on public.decks for select
  using (status = 'published');

-- slides: readable if their deck is published
create policy "slides of published decks are public"
  on public.slides for select
  using (
    exists (
      select 1 from public.decks d
      where d.id = slides.deck_id and d.status = 'published'
    )
  );

-- media: anyone can read (public assets)
create policy "media is public"
  on public.media for select
  using (true);

-- ═══════════════════════════════════════════════════════════════════════
-- COMMENTS for documentation
-- ═══════════════════════════════════════════════════════════════════════
comment on table public.themes is 'Design tokens (colors, fonts) for the default theme and per-variant overrides.';
comment on table public.audiences is 'Recipients of the deck — VCs, maisons, accelerators, strategic partners.';
comment on table public.decks is 'A deck variant. Master deck has parent_id null. Variants reference a parent + audience.';
comment on table public.slides is 'Individual slides. content is JSONB shaped per slide type — see the renderer for the schema.';
comment on table public.media is 'Uploaded images, gifs, videos. Stored in Supabase Storage, referenced by public_url.';
