-- ============================================================
-- 004 — Product catalog performance indexes
-- ============================================================

create index if not exists products_active_created_at_idx
  on public.products (is_active, created_at desc);

create index if not exists products_active_sort_order_idx
  on public.products (is_active, sort_order asc);

create index if not exists products_active_category_idx
  on public.products (is_active, category);

create index if not exists products_active_price_idx
  on public.products (is_active, price);
