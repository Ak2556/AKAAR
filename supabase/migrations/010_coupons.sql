-- ============================================================
-- 010 — Coupons / promo codes
-- ============================================================

create type public.coupon_type as enum ('PERCENT', 'FIXED', 'FREE_SHIPPING');

create table if not exists public.coupons (
  id              uuid          primary key default gen_random_uuid(),
  code            text          not null unique,        -- stored upper-case
  description     text,
  type            coupon_type   not null,
  -- percent: discount value is 0-100; fixed: rupees off; free_shipping: ignored
  value           numeric(10,2) not null default 0,
  min_order_total numeric(10,2),                        -- NULL = no minimum
  max_discount    numeric(10,2),                        -- caps percent discount
  max_uses        integer,                              -- NULL = unlimited
  used_count      integer       not null default 0,
  starts_at       timestamptz,
  expires_at      timestamptz,
  is_active       boolean       not null default true,
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create trigger coupons_updated_at
  before update on public.coupons
  for each row execute function public.set_updated_at();

create index coupons_active_idx on public.coupons(code, is_active);

alter table public.coupons enable row level security;

-- Customers don't read this table directly — validation happens via
-- the API which uses the service role.
create policy "Admins can read coupons"
  on public.coupons for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'ADMIN'
    )
  );

create policy "Admins can manage coupons"
  on public.coupons for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'ADMIN'
    )
  );

-- Track coupons applied to specific orders for audit + analytics
alter table public.orders
  add column if not exists coupon_id          uuid references public.coupons(id),
  add column if not exists coupon_code        text,
  add column if not exists coupon_discount    numeric(10,2) not null default 0;
