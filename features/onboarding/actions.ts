"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import { createOrganizationSchema } from "@/features/onboarding/schemas";

export type OnboardingActionState = { error: string } | null;

export async function createOrganization(
  _prevState: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  const parsed = createOrganizationSchema.safeParse({ name: formData.get("name") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nom invalide." };
  }

  const supabase = await createClient();

  // Slugs are globally unique (see organizations.slug) but not yet
  // user-facing, so a short random suffix avoids collisions between two
  // businesses with the same name without bothering the user about it.
  const slug = `${slugify(parsed.data.name)}-${randomUUID().slice(0, 6)}`;

  const { error } = await supabase.rpc("create_organization", {
    p_name: parsed.data.name,
    p_slug: slug,
  });

  if (error) {
    return { error: "Impossible de créer votre espace de travail. Réessayez." };
  }

  redirect("/dashboard");
}
