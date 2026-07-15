import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck } from "lucide-react";

import { AuthShell } from "@/features/auth/components/auth-shell";

export const metadata: Metadata = { title: "Vérifiez votre e-mail — EchoPilot" };

export default function CheckEmailPage() {
  return (
    <AuthShell
      title="Vérifiez votre boîte mail"
      description="Nous vous avons envoyé un lien de confirmation."
      footer={
        <>
          Vous n&apos;avez rien reçu ?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Réessayer
          </Link>
        </>
      }
    >
      <div className="flex flex-col items-center gap-3 py-2 text-center text-sm text-muted-foreground">
        <MailCheck className="size-10 text-primary" />
        <p>Cliquez sur le lien reçu par e-mail pour activer votre compte et accéder à votre tableau de bord.</p>
      </div>
    </AuthShell>
  );
}
