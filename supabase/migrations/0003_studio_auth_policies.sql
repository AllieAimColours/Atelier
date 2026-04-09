-- ═══════════════════════════════════════════════════════════════════════
-- THE ATELIER · 0003 · STUDIO AUTH POLICIES
-- ═══════════════════════════════════════════════════════════════════════
-- Allows authenticated users to manage decks, slides, audiences, themes,
-- and media. The Studio is for one user (the founder) — auth is handled
-- via Supabase Auth magic link, with email allowlisted in app code.
--
-- Note: We don't restrict by email at the RLS level because that would
-- require hard-coding emails in SQL. The app-level allowlist is the
-- enforcement point. Anyone with a valid Supabase Auth session can write,
-- but only allowlisted emails can obtain a session via /studio/login.
-- ═══════════════════════════════════════════════════════════════════════

-- ─── DECKS ────────────────────────────────────────────────────────────────
create policy "authenticated can read all decks"
  on public.decks for select
  to authenticated
  using (true);

create policy "authenticated can insert decks"
  on public.decks for insert
  to authenticated
  with check (true);

create policy "authenticated can update decks"
  on public.decks for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete decks"
  on public.decks for delete
  to authenticated
  using (true);

-- ─── SLIDES ───────────────────────────────────────────────────────────────
create policy "authenticated can read all slides"
  on public.slides for select
  to authenticated
  using (true);

create policy "authenticated can insert slides"
  on public.slides for insert
  to authenticated
  with check (true);

create policy "authenticated can update slides"
  on public.slides for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete slides"
  on public.slides for delete
  to authenticated
  using (true);

-- ─── AUDIENCES ────────────────────────────────────────────────────────────
create policy "authenticated can insert audiences"
  on public.audiences for insert
  to authenticated
  with check (true);

create policy "authenticated can update audiences"
  on public.audiences for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete audiences"
  on public.audiences for delete
  to authenticated
  using (true);

-- ─── THEMES ───────────────────────────────────────────────────────────────
create policy "authenticated can insert themes"
  on public.themes for insert
  to authenticated
  with check (true);

create policy "authenticated can update themes"
  on public.themes for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete themes"
  on public.themes for delete
  to authenticated
  using (true);

-- ─── MEDIA ────────────────────────────────────────────────────────────────
create policy "authenticated can insert media"
  on public.media for insert
  to authenticated
  with check (true);

create policy "authenticated can update media"
  on public.media for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete media"
  on public.media for delete
  to authenticated
  using (true);
