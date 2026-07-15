-- ============================================================================
-- Row Level Security. Every table is tenant-scoped by organization_id
-- (directly or transitively) and readable/writable only by members of that
-- organization, via the private.is_organization_member/_admin helpers
-- defined in 20260715120100_organizations_and_members.sql.
--
-- Tables written exclusively by trusted server code (Google sync, Stripe
-- webhooks, n8n) intentionally get no INSERT/UPDATE/DELETE policy for
-- `authenticated` — those operations go through lib/supabase/admin.ts
-- (service role), which bypasses RLS entirely.
-- ============================================================================

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.google_connections enable row level security;
alter table public.businesses enable row level security;
alter table public.reviews enable row level security;
alter table public.ai_responses enable row level security;
alter table public.subscriptions enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.audit_logs enable row level security;

-- ---------------------------------------------------------------- organizations

create policy "Members can view their organization"
  on public.organizations for select
  using (private.is_organization_member(id));

create policy "Admins can update their organization"
  on public.organizations for update
  using (private.is_organization_admin(id))
  with check (private.is_organization_admin(id));

create policy "Owners can delete their organization"
  on public.organizations for delete
  using (private.organization_role(id) = 'owner');

-- No INSERT policy: rows are created exclusively through the
-- public.create_organization() SECURITY DEFINER function.

-- ---------------------------------------------------------------- profiles

create policy "Users can view their own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can view teammates' profiles"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.organization_members mine
      join public.organization_members theirs
        on theirs.organization_id = mine.organization_id
      where mine.user_id = auth.uid()
        and theirs.user_id = profiles.id
    )
  );

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- No INSERT/DELETE policy: managed by the handle_new_user trigger and the
-- auth.users -> profiles cascade delete.

-- ---------------------------------------------------------------- organization_members

create policy "Members can view their organization's roster"
  on public.organization_members for select
  using (private.is_organization_member(organization_id));

create policy "Admins can add members"
  on public.organization_members for insert
  with check (private.is_organization_admin(organization_id));

create policy "Admins can change member roles"
  on public.organization_members for update
  using (private.is_organization_admin(organization_id))
  with check (private.is_organization_admin(organization_id));

create policy "Admins can remove members, members can leave"
  on public.organization_members for delete
  using (private.is_organization_admin(organization_id) or user_id = auth.uid());

-- ---------------------------------------------------------------- google_connections

create policy "Members can view Google connections"
  on public.google_connections for select
  using (private.is_organization_member(organization_id));

create policy "Admins can manage Google connections"
  on public.google_connections for all
  using (private.is_organization_admin(organization_id))
  with check (private.is_organization_admin(organization_id));

-- ---------------------------------------------------------------- businesses

create policy "Members can view businesses"
  on public.businesses for select
  using (private.is_organization_member(organization_id));

create policy "Admins can manage businesses"
  on public.businesses for all
  using (private.is_organization_admin(organization_id))
  with check (private.is_organization_admin(organization_id));

-- ---------------------------------------------------------------- reviews

create policy "Members can view reviews of their businesses"
  on public.reviews for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = reviews.business_id
        and private.is_organization_member(b.organization_id)
    )
  );

create policy "Members can update reviews of their businesses"
  on public.reviews for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = reviews.business_id
        and private.is_organization_member(b.organization_id)
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = reviews.business_id
        and private.is_organization_member(b.organization_id)
    )
  );

-- No INSERT/DELETE policy: reviews are synced server-side (service role).

-- ---------------------------------------------------------------- ai_responses

create policy "Members can view responses to their reviews"
  on public.ai_responses for select
  using (
    exists (
      select 1
      from public.reviews r
      join public.businesses b on b.id = r.business_id
      where r.id = ai_responses.review_id
        and private.is_organization_member(b.organization_id)
    )
  );

create policy "Members can manage responses to their reviews"
  on public.ai_responses for all
  using (
    exists (
      select 1
      from public.reviews r
      join public.businesses b on b.id = r.business_id
      where r.id = ai_responses.review_id
        and private.is_organization_member(b.organization_id)
    )
  )
  with check (
    exists (
      select 1
      from public.reviews r
      join public.businesses b on b.id = r.business_id
      where r.id = ai_responses.review_id
        and private.is_organization_member(b.organization_id)
    )
  );

-- ---------------------------------------------------------------- subscriptions

create policy "Members can view their subscription"
  on public.subscriptions for select
  using (private.is_organization_member(organization_id));

-- No INSERT/UPDATE/DELETE policy: managed exclusively by the Stripe webhook
-- handler (service role) — never trust the client with billing state.

-- ---------------------------------------------------------------- notifications

create policy "Users can view their notifications"
  on public.notifications for select
  using (
    user_id = auth.uid()
    or (user_id is null and private.is_organization_member(organization_id))
  );

create policy "Users can mark their notifications as read"
  on public.notifications for update
  using (
    user_id = auth.uid()
    or (user_id is null and private.is_organization_member(organization_id))
  )
  with check (
    user_id = auth.uid()
    or (user_id is null and private.is_organization_member(organization_id))
  );

-- No INSERT/DELETE policy: notifications are created by server-side events.

-- ---------------------------------------------------------------- ai_recommendations

create policy "Members can view recommendations"
  on public.ai_recommendations for select
  using (private.is_organization_member(organization_id));

create policy "Members can acknowledge or dismiss recommendations"
  on public.ai_recommendations for update
  using (private.is_organization_member(organization_id))
  with check (private.is_organization_member(organization_id));

-- No INSERT/DELETE policy: recommendations are generated server-side.

-- ---------------------------------------------------------------- audit_logs

create policy "Admins can view their organization's audit log"
  on public.audit_logs for select
  using (private.is_organization_admin(organization_id));

-- No INSERT/UPDATE/DELETE policy: the log is append-only and written
-- exclusively by trusted server code (service role).
