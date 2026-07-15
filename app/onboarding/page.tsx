import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Bienvenue — EchoPilot" };

// Always reads a live session — see the same note in app/dashboard/page.tsx.
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1)
    .maybeSingle();

  if (membership) {
    redirect("/dashboard");
  }

  return (
    <AuthShell title="Bienvenue sur EchoPilot" description="Créons l'espace de travail de votre entreprise.">
      <OnboardingForm />
    </AuthShell>
  );
}
