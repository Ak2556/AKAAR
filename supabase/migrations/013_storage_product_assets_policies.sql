-- ============================================================
-- 013 — Storage RLS policies for the product-assets bucket
-- ============================================================
--
-- The admin product create/edit forms upload preview images and
-- GLB/GLTF models directly from the browser using the signed-in
-- admin's session (see ProductCreateForm.tsx / ProductEditForm.tsx).
-- Those uploads run against storage.objects under RLS — NOT the
-- service role — so without an INSERT policy every upload fails with:
--
--   new row violates row-level security policy for table "objects"
--
-- and the form shows "Storage upload failed: ...". Product images
-- still *read* fine because the bucket is public, masking the issue
-- until someone tries to add or edit a product.
--
-- Fix: make the bucket public for reads and allow admins
-- (public.is_admin()) to insert/update/delete objects in it.
-- Run this in the Supabase SQL editor (it owns storage.objects).

-- Ensure the bucket exists and is public for reads.
insert into storage.buckets (id, name, public)
values ('product-assets', 'product-assets', true)
on conflict (id) do update set public = true;

-- Public read — covers anonymous storefront image loads.
drop policy if exists "product-assets public read" on storage.objects;
create policy "product-assets public read"
  on storage.objects for select
  using (bucket_id = 'product-assets');

-- Admin insert — admin uploads new images/models.
drop policy if exists "product-assets admin insert" on storage.objects;
create policy "product-assets admin insert"
  on storage.objects for insert
  with check (bucket_id = 'product-assets' and public.is_admin());

-- Admin update — `upsert: true` uploads overwrite existing objects.
drop policy if exists "product-assets admin update" on storage.objects;
create policy "product-assets admin update"
  on storage.objects for update
  using (bucket_id = 'product-assets' and public.is_admin())
  with check (bucket_id = 'product-assets' and public.is_admin());

-- Admin delete — replacing or removing a product asset.
drop policy if exists "product-assets admin delete" on storage.objects;
create policy "product-assets admin delete"
  on storage.objects for delete
  using (bucket_id = 'product-assets' and public.is_admin());
