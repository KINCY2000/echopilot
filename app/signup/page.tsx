import Link from "next/link";
import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = { title: "Créer un compte — EchoPilot" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Créez votre compte"
      description="Votre réputation, pilotée par l'IA — en moins de 2 minutes."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
