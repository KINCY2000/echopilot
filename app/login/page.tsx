import Link from "next/link";
import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Connexion — EchoPilot" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell
      title="Content de vous revoir"
      description="Connectez-vous pour piloter votre réputation."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
