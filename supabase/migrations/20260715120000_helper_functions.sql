-- ============================================================================
-- Helper functions used by every subsequent migration.
-- ============================================================================

-- Non-public schema for RLS helper functions: SECURITY DEFINER functions
-- must never live in `public` where PostgREST could expose them as callable
-- RPCs unless explicitly intended (see public.create_organization instead).
create schema if not exists private;

-- Generic "touch updated_at" trigger, reused by every table below.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger function: sets updated_at = now() on every UPDATE.';
