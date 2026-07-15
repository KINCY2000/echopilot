-- ============================================================================
-- Log organization creation to the audit trail (Module 3: the first
-- meaningful action a new account takes). CREATE OR REPLACE keeps the same
-- signature/grants from 20260715120100_organizations_and_members.sql.
-- ============================================================================

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

  insert into public.audit_logs (organization_id, actor_id, action, target_type, target_id)
  values (v_org.id, auth.uid(), 'organization.created', 'organization', v_org.id);

  return v_org;
end;
$$;
