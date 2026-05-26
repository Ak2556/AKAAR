-- ============================================================
-- 011 — Persistent cart for logged-in users
-- ============================================================

create table if not exists public.carts (
  user_id     uuid        primary key references public.profiles(id) on delete cascade,
  items       jsonb       not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger carts_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

alter table public.carts enable row level security;

create policy "Owners can read their cart"
  on public.carts for select
  using (auth.uid() = user_id);

create policy "Owners can upsert their cart"
  on public.carts for insert
  with check (auth.uid() = user_id);

create policy "Owners can update their cart"
  on public.carts for update
  using (auth.uid() = user_id);

create policy "Owners can delete their cart"
  on public.carts for delete
  using (auth.uid() = user_id);
