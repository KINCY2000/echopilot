-- ============================================================================
-- Reviews synced from Google, their AI analysis, and generated responses.
-- ============================================================================

create type public.review_status as enum ('pending', 'answered', 'ignored');
create type public.review_sentiment as enum ('positive', 'negative', 'neutral', 'mixed');
create type public.review_urgency as enum ('low', 'medium', 'high', 'critical');

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  google_review_id text not null,
  reviewer_name text not null,
  reviewer_photo_url text,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  review_created_at timestamptz not null,
  language text,
  status public.review_status not null default 'pending',

  -- Populated by the AI analysis pipeline (Module 5). Null until analyzed.
  sentiment public.review_sentiment,
  urgency public.review_urgency,
  themes text[] not null default '{}',
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  analyzed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, google_review_id)
);

comment on table public.reviews is 'A customer review synced from a Google Business Profile location.';

create trigger set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

create index reviews_business_id_idx on public.reviews (business_id);
create index reviews_status_idx on public.reviews (status);
create index reviews_business_status_idx on public.reviews (business_id, status);
create index reviews_review_created_at_idx on public.reviews (review_created_at desc);

-- ----------------------------------------------------------------------------

create type public.ai_response_status as enum ('draft', 'published', 'failed');
create type public.ai_response_tone as enum ('chaleureux', 'professionnel', 'premium', 'dynamique');
create type public.ai_response_generated_by as enum ('ai', 'human');

create table public.ai_responses (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 4000),
  tone public.ai_response_tone not null default 'chaleureux',
  status public.ai_response_status not null default 'draft',
  generated_by public.ai_response_generated_by not null default 'ai',
  created_by uuid references public.profiles (id) on delete set null,
  google_reply_error text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.ai_responses is
  'A generated (or human-edited) reply to a review. Multiple drafts can exist per review; at most one may be published.';

create trigger set_updated_at
  before update on public.ai_responses
  for each row execute function public.set_updated_at();

create index ai_responses_review_id_idx on public.ai_responses (review_id);

-- At most one published response per review.
create unique index ai_responses_one_published_per_review_idx
  on public.ai_responses (review_id)
  where (status = 'published');
