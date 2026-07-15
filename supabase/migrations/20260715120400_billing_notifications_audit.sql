-- ============================================================================
-- Stripe subscriptions, in-app notifications, AI recommendations, audit log.
-- ============================================================================

create type public.subscription_plan as enum ('trial', 'starter', 'pro', 'business');
create type public.subscription_status as enum (
  'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid'
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan public.subscription_plan not null default 'trial',
  status public.subscription_status not null default 'trialing',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.subscriptions is 'One Stripe subscription per organization (single active plan).';

create trigger set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

create index subscriptions_organization_id_idx on public.subscriptions (organization_id);

-- ----------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  -- Null user_id = broadcast to every member of the organization.
  user_id uuid references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.notifications is 'In-app notifications (new negative review, token expiring, payment failed, ...).';

create index notifications_org_unread_idx on public.notifications (organization_id, read_at);
create index notifications_user_id_idx on public.notifications (user_id);

-- ----------------------------------------------------------------------------

create type public.recommendation_priority as enum ('low', 'medium', 'high');
create type public.recommendation_status as enum ('new', 'acknowledged', 'dismissed');

create table public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  business_id uuid references public.businesses (id) on delete cascade,
  type text not null,
  title text not null,
  description text not null,
  priority public.recommendation_priority not null default 'medium',
  status public.recommendation_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.ai_recommendations is
  'AI-generated suggestions surfaced on the dashboard (e.g. "reply faster to negative reviews").';

create trigger set_updated_at
  before update on public.ai_recommendations
  for each row execute function public.set_updated_at();

create index ai_recommendations_organization_id_idx on public.ai_recommendations (organization_id);
create index ai_recommendations_business_id_idx on public.ai_recommendations (business_id);

-- ----------------------------------------------------------------------------

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  -- Null actor_id = performed by the system (webhook, cron job, n8n).
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.audit_logs is 'Immutable trail of sensitive actions (publish response, connect Google account, change plan, ...).';

create index audit_logs_organization_id_created_at_idx on public.audit_logs (organization_id, created_at desc);
