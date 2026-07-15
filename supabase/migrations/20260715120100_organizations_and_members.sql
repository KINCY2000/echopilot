-- ============================================================================
-- Multi-tenancy core: organizations, user profiles, and membership.
--
-- One "organization" = one EchoPilot customer account. It can own several
-- Google Business Profile locations (businesses) and has its own
-- subscription. Users belong to organizations through organization_members
-- with a role (owner / admin / member).
-- ============================================================================

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organizations is 'One EchoPilot customer account (tenant).';

create trigger set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------

-- Mirrors auth.users 1:1. Kept separate from auth.users (owned by Supabase
-- Auth) so the app can store/query profile data through PostgREST with
-- ordinary RLS instead of the restricted auth schema.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public profile data for an auth.users row.';

create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------

create type public.organization_role as enum ('owner', 'admin', 'member');

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.organization_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

comment on table public.organization_members is 'Join table: which users belong to which organization, with which role.';

create index organization_members_user_id_idx on public.organization_members (user_id);
create index organization_members_organization_id_idx on public.organization_members (organization_id);

-- ----------------------------------------------------------------------------
-- Atomically create an organization and make the calling user its owner.
-- Bypasses RLS (SECURITY DEFINER) to sidestep the chicken-and-egg problem of
-- inserting the first organization_members row before any membership exists.
create or replace function public.create_organization(p_name text, p_slug text)
returns public.organizations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org public.organizations;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.organizations (name, slug)
  values (p_name, p_slug)
  returning * into v_org;

  insert into public.organization_members (organization_id, user_id, role)
  values (v_org.id, auth.uid(), 'owner');

  return v_org;
end;
$$;

comment on function public.create_organization(text, text) is
  'Creates an organization and adds the calling user as owner. Use instead of inserting into organizations directly.';

grant execute on function public.create_organization(text, text) to authenticated;

-- ----------------------------------------------------------------------------
-- RLS helpers. SECURITY DEFINER + fixed search_path so they read
-- organization_members without being subject to (and recursing into) the
-- RLS policies defined on it below.

create or replace function private.is_organization_member(p_organization_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = p_organization_id
      and user_id = auth.uid()
  );
$$;

create or replace function private.organization_role(p_organization_id uuid)
returns public.organization_role
language sql
security definer
stable
set search_path = public
as $$
  select role
  from public.organization_members
  where organization_id = p_organization_id
    and user_id = auth.uid()
  limit 1;
$$;

create or replace function private.is_organization_admin(p_organization_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(private.organization_role(p_organization_id) in ('owner', 'admin'), false);
$$;
