import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { Dashboard } from "@/features/dashboard/dashboard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Tableau de bord — EchoPilot" };

// This page always reads a live session — it can never be statically
// prerendered, so make that explicit instead of relying on Next.js to infer
// it from cookies()/auth calls (which still attempts a build-time prerender
// pass first and would otherwise fail loudly whenever Supabase env vars
// aren't configured, e.g. in a CI job that only needs `next build` to type-check).
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase
      .from("organization_members")
      .select("role, organizations(name)")
      .limit(1)
      .maybeSingle(),
  ]);

  if (!membership) {
    redirect("/onboarding");
  }

  const userFullName = profile?.full_name?.trim() || user.email || "Utilisateur";
  const organizationName = membership.organizations?.name ?? "Votre entreprise";

  return (
    <Dashboard
      organizationName={organizationName}
      userFullName={userFullName}
      userFirstName={userFullName.split(" ")[0]}
      role={membership.role}
    />
  );
}
