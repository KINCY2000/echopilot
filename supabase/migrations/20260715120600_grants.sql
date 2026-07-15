-- ============================================================================
-- Explicit privilege grants for the `authenticated` role.
--
-- Supabase's "auto-expose new tables" default has changed across platform
-- versions (see supabase/config.toml comment on api.auto_expose_new_tables)
-- — new projects do NOT automatically grant PostgREST roles access to new
-- tables. RLS policies alone are not sufficient: a GRANT denial and an RLS
-- denial both block access, so we grant explicitly here rather than depend
-- on an implicit platform default that may change again.
--
-- Only the operations that have a matching RLS policy for `authenticated`
-- are granted (see 20260715120500_rls_policies.sql) — tables written
-- exclusively by trusted server code (service role) get no grant here.
-- ============================================================================

grant usage on schema public to authenticated;

grant select, update, delete on public.organizations to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.organization_members to authenticated;
grant select, insert, update, delete on public.google_connections to authenticated;
grant select, insert, update, delete on public.businesses to authenticated;
grant select, update on public.reviews to authenticated;
grant select, insert, update, delete on public.ai_responses to authenticated;
grant select on public.subscriptions to authenticated;
grant select, update on public.notifications to authenticated;
grant select, update on public.ai_recommendations to authenticated;
grant select on public.audit_logs to authenticated;
