-- ============================================================
-- 005 — Multi-photo support on products
-- ============================================================
-- Adds an `images text[]` column to hold the full ordered list of
-- preview photos. The legacy `image_url` column stays as the cover
-- image (first entry of `images`). Existing rows are backfilled so
-- that `images = [image_url]` when image_url is present.

alter table public.products
  add column if not exists images text[];

update public.products
  set images = array[image_url]
  where images is null
    and image_url is not null;
