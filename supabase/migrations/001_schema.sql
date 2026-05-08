-- ============================================================
-- AKAAR — Supabase Schema
-- Run this in the Supabase SQL editor:
-- https://supabase.com/dashboard/project/mpdjjxkkjuhnqcynclin/sql
-- ============================================================

-- gen_random_uuid() is replaced by gen_random_uuid() (built-in, no extension needed)

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role     as enum ('CUSTOMER', 'ADMIN');
create type order_status  as enum ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED');
create type payment_status as enum ('PENDING','AUTHORIZED','CAPTURED','FAILED','REFUNDED');
create type quote_status  as enum ('PENDING','REVIEWING','QUOTED','ACCEPTED','REJECTED','EXPIRED');
create type audit_status  as enum ('SUCCESS','FAILED','BLOCKED');

-- ============================================================
-- PROFILES  (extends auth.users — 1:1)
-- ============================================================

create table public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  name        text,
  email       text        not null unique,
  image       text,
  role        user_role   not null default 'CUSTOMER',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, image)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- MESH FILES
-- ============================================================

create table public.mesh_files (
  id                  uuid        primary key default gen_random_uuid(),
  original_filename   text        not null,
  stored_filename     text,
  storage_path        text,
  file_type           text        not null,
  file_size           integer     not null,
  s3_key              text        unique,
  s3_bucket           text,
  volume_mm3          numeric,
  surface_area_mm2    numeric,
  bounding_box_x      numeric,
  bounding_box_y      numeric,
  bounding_box_z      numeric,
  is_processed        boolean     not null default false,
  created_at          timestamptz not null default now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================

create table public.products (
  id                  uuid        primary key default gen_random_uuid(),
  name                text        not null,
  slug                text        not null unique,
  description         text,
  short_description   text,
  image_url           text,
  category            text,
  sort_order          integer     not null default 0,
  is_active           boolean     not null default true,
  price               numeric(10,2),
  mesh_file_id        uuid        unique references public.mesh_files(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create index products_slug_idx      on public.products(slug);
create index products_category_idx  on public.products(category);
create index products_is_active_idx on public.products(is_active);

-- ============================================================
-- ADDRESSES
-- ============================================================

create table public.addresses (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  label       text,
  type        text        not null default 'home',
  first_name  text        not null,
  last_name   text        not null,
  address     text        not null,
  apartment   text,
  city        text        not null,
  state       text        not null,
  zip         text        not null,
  country     text        not null default 'India',
  phone       text,
  is_default  boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger addresses_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

create index addresses_user_id_idx on public.addresses(user_id);

-- ============================================================
-- ORDERS
-- ============================================================

create table public.orders (
  id                  uuid           primary key default gen_random_uuid(),
  order_number        text           not null unique,
  user_id             uuid           references public.profiles(id),
  status              order_status   not null default 'PENDING',
  subtotal            numeric(10,2)  not null,
  shipping_cost       numeric(10,2)  not null,
  tax                 numeric(10,2)  not null,
  total               numeric(10,2)  not null,
  shipping_method     text           not null,
  shipping_address    jsonb          not null,
  payment_method      text,
  payment_status      payment_status not null default 'PENDING',
  razorpay_order_id   text           unique,
  razorpay_payment_id text,
  razorpay_signature  text,
  email               text           not null,
  phone               text,
  notes               text,
  created_at          timestamptz    not null default now(),
  updated_at          timestamptz    not null default now()
);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create index orders_user_id_idx      on public.orders(user_id);
create index orders_order_number_idx on public.orders(order_number);
create index orders_status_idx       on public.orders(status);

-- ============================================================
-- ORDER ITEMS
-- ============================================================

create table public.order_items (
  id          uuid           primary key default gen_random_uuid(),
  order_id    uuid           not null references public.orders(id) on delete cascade,
  product_id  uuid           references public.products(id),
  name        text           not null,
  slug        text,
  material    text,
  quantity    integer        not null,
  unit_price  numeric(10,2)  not null,
  total_price numeric(10,2)  not null,
  created_at  timestamptz    not null default now()
);

create index order_items_order_id_idx on public.order_items(order_id);

-- ============================================================
-- QUOTE REQUESTS
-- ============================================================

create table public.quote_requests (
  id              uuid         primary key default gen_random_uuid(),
  quote_number    text         not null unique,
  user_id         uuid         references public.profiles(id),
  status          quote_status not null default 'PENDING',
  name            text         not null,
  email           text         not null,
  company         text,
  phone           text,
  service         text         not null,
  material        text         not null,
  quantity        integer      not null,
  notes           text,
  quoted_price    numeric(10,2),
  response_notes  text,
  responded_at    timestamptz,
  created_at      timestamptz  not null default now(),
  updated_at      timestamptz  not null default now()
);

create trigger quote_requests_updated_at
  before update on public.quote_requests
  for each row execute function public.set_updated_at();

create index quote_requests_user_id_idx on public.quote_requests(user_id);
create index quote_requests_status_idx  on public.quote_requests(status);

-- ============================================================
-- QUOTE FILES
-- ============================================================

create table public.quote_files (
  id                uuid        primary key default gen_random_uuid(),
  quote_request_id  uuid        not null references public.quote_requests(id) on delete cascade,
  original_filename text        not null,
  stored_filename   text        not null,
  s3_key            text        not null,
  s3_bucket         text        not null,
  file_size         integer     not null,
  file_type         text        not null,
  uploaded_at       timestamptz not null default now()
);

create index quote_files_quote_id_idx on public.quote_files(quote_request_id);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

create table public.audit_logs (
  id            uuid         primary key default gen_random_uuid(),
  user_id       uuid         references public.profiles(id),
  action        text         not null,
  entity_type   text         not null,
  entity_id     uuid,
  ip_address    text,
  user_agent    text,
  metadata      jsonb,
  status        audit_status not null default 'SUCCESS',
  error_message text,
  created_at    timestamptz  not null default now()
);

create index audit_logs_user_id_idx    on public.audit_logs(user_id);
create index audit_logs_action_idx     on public.audit_logs(action);
create index audit_logs_entity_idx     on public.audit_logs(entity_type, entity_id);
create index audit_logs_created_at_idx on public.audit_logs(created_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles        enable row level security;
alter table public.mesh_files      enable row level security;
alter table public.products        enable row level security;
alter table public.addresses       enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.quote_requests  enable row level security;
alter table public.quote_files     enable row level security;
alter table public.audit_logs      enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN'
  );
$$;

-- ---- PROFILES ----
create policy "Users can view their own profile"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- ---- MESH FILES ----
create policy "Anyone can view mesh files"
  on public.mesh_files for select using (true);

create policy "Admins can manage mesh files"
  on public.mesh_files for all using (public.is_admin());

-- ---- PRODUCTS ----
create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true or public.is_admin());

create policy "Admins can manage products"
  on public.products for all using (public.is_admin());

-- ---- ADDRESSES ----
create policy "Users can view their own addresses"
  on public.addresses for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Users can insert their own addresses"
  on public.addresses for insert
  with check (user_id = auth.uid());

create policy "Users can update their own addresses"
  on public.addresses for update
  using (user_id = auth.uid());

create policy "Users can delete their own addresses"
  on public.addresses for delete
  using (user_id = auth.uid());

-- ---- ORDERS ----
create policy "Users can view their own orders"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Users can create orders"
  on public.orders for insert
  with check (user_id = auth.uid() or user_id is null);

create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin());

-- ---- ORDER ITEMS ----
create policy "Users can view items of their orders"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Orders can have items inserted"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
    )
  );

-- ---- QUOTE REQUESTS ----
create policy "Users can view their own quotes"
  on public.quote_requests for select
  using (user_id = auth.uid() or email = (select email from public.profiles where id = auth.uid()) or public.is_admin());

create policy "Anyone can create a quote"
  on public.quote_requests for insert
  with check (true);

create policy "Admins can update quotes"
  on public.quote_requests for update
  using (public.is_admin());

-- ---- QUOTE FILES ----
create policy "Users can view files of their quotes"
  on public.quote_files for select
  using (
    exists (
      select 1 from public.quote_requests qr
      where qr.id = quote_files.quote_request_id
        and (qr.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Anyone can insert quote files"
  on public.quote_files for insert
  with check (true);

-- ---- AUDIT LOGS ----
create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (public.is_admin());

create policy "System can insert audit logs"
  on public.audit_logs for insert
  with check (true);
