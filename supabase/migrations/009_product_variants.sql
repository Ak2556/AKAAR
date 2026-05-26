-- ============================================================
-- 009 — Product variants (material + optional color)
-- ============================================================

create table if not exists public.product_variants (
  id              uuid          primary key default gen_random_uuid(),
  product_id      uuid          not null references public.products(id) on delete cascade,
  material        text          not null,     -- 'PLA', 'PETG', 'ABS', 'TPU', 'Resin'
  color           text,                       -- 'White', 'Saffron', ...
  color_hex       text,                       -- '#ffffff' for the swatch
  price_modifier  numeric(10,2) not null default 0,  -- delta on top of products.price
  stock_quantity  integer,                    -- NULL = made-to-order
  sku             text          unique,
  sort_order      integer       not null default 0,
  is_default      boolean       not null default false,
  is_active       boolean       not null default true,
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create trigger product_variants_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

create index product_variants_product_idx     on public.product_variants(product_id);
create index product_variants_active_idx      on public.product_variants(product_id, is_active);
create unique index product_variants_default
  on public.product_variants(product_id)
  where is_default = true;

alter table public.product_variants enable row level security;

create policy "Anyone can read active variants"
  on public.product_variants for select
  using (is_active = true);

create policy "Admins can manage variants"
  on public.product_variants for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'ADMIN'
    )
  );

-- Track the chosen variant on an order line so we can fulfil correctly
alter table public.order_items
  add column if not exists variant_id uuid references public.product_variants(id);
