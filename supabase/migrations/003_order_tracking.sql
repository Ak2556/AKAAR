-- ============================================================
-- Migration 003: Add tracking fields to orders
-- ============================================================

alter table public.orders
  add column if not exists tracking_number text,
  add column if not exists tracking_url    text,
  add column if not exists status_notes    text;
