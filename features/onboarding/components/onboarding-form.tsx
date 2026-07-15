"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrganization, type OnboardingActionState } from "@/features/onboarding/actions";

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState<OnboardingActionState, FormData>(createOrganization, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nom de votre entreprise</Label>
        <Input id="name" name="name" type="text" required placeholder="Le Bistrot Parisien" autoFocus />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Création..." : "Créer mon espace de travail"}
      </Button>
    </form>
  );
}
