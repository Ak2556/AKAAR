-- ============================================================
-- 006 — Product reviews (ratings + verified-purchase signal)
-- ============================================================

create table if not exists public.product_reviews (
  id                   uuid        primary key default gen_random_uuid(),
  product_id           uuid        not null references public.products(id) on delete cascade,
  user_id              uuid        not null references public.profiles(id) on delete cascade,
  order_id             uuid        references public.orders(id) on delete set null,
  rating               integer     not null check (rating between 1 and 5),
  title                text,
  body                 text,
  verified_purchase    boolean     not null default false,
  is_visible           boolean     not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  -- One review per (product, user) pair; users can edit but not duplicate
  constraint product_reviews_unique_per_user unique (product_id, user_id)
);

create trigger product_reviews_updated_at
  before update on public.product_reviews
  for each row execute function public.set_updated_at();

create index product_reviews_product_idx     on public.product_reviews(product_id);
create index product_reviews_user_idx        on public.product_reviews(user_id);
create index product_reviews_visible_idx     on public.product_reviews(product_id, is_visible);

alter table public.product_reviews enable row level security;

-- Public read of visible reviews
create policy "Anyone can read visible reviews"
  on public.product_reviews for select
  using (is_visible = true);

-- Owners can read their own reviews regardless of visibility
create policy "Authors can read their own reviews"
  on public.product_reviews for select
  using (auth.uid() = user_id);

-- Authors can create their own reviews
create policy "Authors can insert their own reviews"
  on public.product_reviews for insert
  with check (auth.uid() = user_id);

-- Authors can edit their own reviews
create policy "Authors can update their own reviews"
  on public.product_reviews for update
  using (auth.uid() = user_id);

-- Authors can delete their own reviews
create policy "Authors can delete their own reviews"
  on public.product_reviews for delete
  using (auth.uid() = user_id);

-- Admins can do anything
create policy "Admins can manage all reviews"
  on public.product_reviews for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'ADMIN'
    )
  );
