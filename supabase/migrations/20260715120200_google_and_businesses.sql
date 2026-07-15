-- ============================================================================
-- Google Business Profile integration: OAuth connections and locations.
-- ============================================================================

create type public.google_connection_status as enum ('connected', 'expired', 'revoked', 'error');

create table public.google_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  google_account_email text not null,
  -- Tokens are encrypted application-side (see lib/google/tokens.ts, Module 4)
  -- before being written here; this column never holds plaintext secrets.
  access_token_encrypted text not null,
  refresh_token_encrypted text not null,
  scope text not null,
  token_expires_at timestamptz not null,
  status public.google_connection_status not null default 'connected',
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.google_connections is
  'One Google OAuth grant (one Google account) connected to an organization. A connection can expose several business locations.';

create trigger set_updated_at
  before update on public.google_connections
  for each row execute function public.set_updated_at();

create index google_connections_organization_id_idx on public.google_connections (organization_id);

-- ----------------------------------------------------------------------------

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  google_connection_id uuid references public.google_connections (id) on delete set null,
  google_location_id text not null,
  name text not null,
  address text,
  phone text,
  website text,
  category text,
  average_rating numeric(2, 1) check (average_rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, google_location_id)
);

comment on table public.businesses is 'A Google Business Profile location synced into EchoPilot.';

create trigger set_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

create index businesses_organization_id_idx on public.businesses (organization_id);
create index businesses_google_connection_id_idx on public.businesses (google_connection_id);
