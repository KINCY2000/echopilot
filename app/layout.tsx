import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EchoPilot — Tableau de bord",
  description: "Assistant IA de gestion de réputation en ligne",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
