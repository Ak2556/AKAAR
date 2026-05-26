-- ============================================================
-- 008 — Stock + lead time on products
-- ============================================================
-- Adds inventory tracking (nullable = "made to order, unlimited")
-- and a lead-time hint surfaced to customers before checkout.

alter table public.products
  add column if not exists stock_quantity integer,
  add column if not exists lead_time_days integer;

create index if not exists products_stock_idx
  on public.products(stock_quantity)
  where stock_quantity is not null;

comment on column public.products.stock_quantity is
  'In-stock units available for immediate dispatch. NULL = made-to-order, unlimited.';
comment on column public.products.lead_time_days is
  'Production lead time in working days. NULL = stocked, dispatches within 48h.';
