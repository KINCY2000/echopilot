"use server";

import { redirect } from "next/navigation";

import { getClientEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/features/auth/schemas";

export type AuthActionState = { error: string } | null;

/** Only redirect to a same-site relative path — never to an external URL. */
function sanitizeRedirectTarget(next: FormDataEntryValue | null): string {
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/dashboard";
}

export async function signIn(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "E-mail ou mot de passe incorrect." };
  }

  redirect(sanitizeRedirectTarget(formData.get("next")));
}

export async function signUp(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${getClientEnv().NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    // Deliberately generic: don't confirm/deny whether the email is
    // already registered (avoids account enumeration).
    return { error: "Impossible de créer le compte. Vérifiez vos informations et réessayez." };
  }

  redirect("/signup/check-email");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
