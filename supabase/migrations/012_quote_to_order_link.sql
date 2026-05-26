-- ============================================================
-- 012 — Quote → Order conversion link
-- ============================================================

alter table public.orders
  add column if not exists quote_id uuid references public.quote_requests(id);

create index if not exists orders_quote_id_idx on public.orders(quote_id);

comment on column public.orders.quote_id is
  'When set, this order was created from an accepted quote_request.';
