import { Bell, ChevronDown, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DashboardHeader({ userFirstName }: { userFirstName: string }) {
  return (
    <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold">Bonjour {userFirstName} 👋</h1>
        <p className="mt-2 text-slate-500">Voici un aperçu de la réputation de votre établissement.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" aria-label="Notifications">
          <Bell size={20} />
        </Button>
        <Button variant="outline">
          <Clock3 size={18} />
          7 derniers jours
          <ChevronDown size={16} />
        </Button>
      </div>
    </header>
  );
}
