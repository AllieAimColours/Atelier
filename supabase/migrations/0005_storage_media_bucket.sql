-- ═══════════════════════════════════════════════════════════════════════
-- THE ATELIER · 0005 · STORAGE MEDIA BUCKET
-- ═══════════════════════════════════════════════════════════════════════
-- Creates a public read / authenticated write Storage bucket called
-- "media" for slide images, gifs, and other assets uploaded from the
-- Studio. Public read so the public deck can serve them without signed
-- URLs; authenticated write so only logged-in users can upload.
-- ═══════════════════════════════════════════════════════════════════════

-- Create the bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,  -- 10 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- ─── Storage RLS ────────────────────────────────────────────────────────
-- Public can read all media files
drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Authenticated users can upload to media bucket
drop policy if exists "media authenticated upload" on storage.objects;
create policy "media authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

-- Authenticated users can update their uploads
drop policy if exists "media authenticated update" on storage.objects;
create policy "media authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

-- Authenticated users can delete media
drop policy if exists "media authenticated delete" on storage.objects;
create policy "media authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
