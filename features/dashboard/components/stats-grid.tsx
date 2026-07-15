import { CircleCheck, Clock3, MessageSquareText, Star } from "lucide-react";

import { StatCard } from "@/features/dashboard/components/stat-card";

/**
 * Hard-coded until Module 8 ("Statistiques & recommandations IA") computes
 * these aggregates from real review data.
 */
export function StatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Note moyenne" value="4,6 ★" note="↑ 0,2 vs la période précédente" icon={<Star size={19} />} />
      <StatCard title="Avis reçus" value="18" note="↑ 3 vs la période précédente" icon={<MessageSquareText size={19} />} />
      <StatCard title="Avis en attente" value="12" note="Dont 4 avis négatifs" icon={<Clock3 size={19} />} />
      <StatCard title="Taux de réponse" value="92%" note="Excellent !" icon={<CircleCheck size={19} />} />
    </div>
  );
}
