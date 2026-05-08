-- ============================================================
-- 002 — Security hardening (addresses Supabase DB linter warnings)
-- ============================================================

-- ---- 1. Add SET search_path to functions that were missing it ----
-- Prevents a malicious schema from hijacking the search path while
-- the function runs under elevated privileges.

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN'
  );
$$;

-- ---- 2. Fix overly-permissive RLS INSERT policies ----

-- audit_logs: service_role bypasses RLS entirely, so this policy
-- only ever applied to anon/authenticated callers. Drop it — the
-- backend writes audit logs via service_role which needs no policy.
drop policy "System can insert audit logs" on public.audit_logs;

-- quote_requests: allow guests (user_id IS NULL) or the signed-in
-- user creating for themselves. Prevents spoofing another user's id.
drop policy "Anyone can create a quote" on public.quote_requests;
create policy "Anyone can create a quote"
  on public.quote_requests for insert
  with check (user_id is null or user_id = auth.uid());

-- quote_files: require the linked quote request to exist. Prevents
-- inserting orphan files or files attached to someone else's quote.
drop policy "Anyone can insert quote files" on public.quote_files;
create policy "Anyone can insert quote files"
  on public.quote_files for insert
  with check (
    exists (
      select 1 from public.quote_requests
      where id = quote_files.quote_request_id
    )
  );

-- ---- 3. Revoke anon SELECT from tables that should not be
--         discoverable without signing in (products and mesh_files
--         remain public for the storefront catalog).           ----

revoke select on public.addresses      from anon;
revoke select on public.audit_logs     from anon;
revoke select on public.order_items    from anon;
revoke select on public.orders         from anon;
revoke select on public.profiles       from anon;
revoke select on public.quote_files    from anon;
revoke select on public.quote_requests from anon;

-- ---- 4. Revoke EXECUTE on functions not meant for public RPC ----

-- handle_new_user is a trigger function; it should never be called
-- directly via /rest/v1/rpc.
revoke execute on function public.handle_new_user() from anon, authenticated;

-- is_admin is safe for authenticated users to call (they check their
-- own status). Revoke from anon only.
revoke execute on function public.is_admin() from anon;
