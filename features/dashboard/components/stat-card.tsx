import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>{title}</span>
        <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600">{icon}</span>
      </div>
      <div className="text-4xl font-bold tracking-tight">{value}</div>
      <div className="mt-3 text-xs text-emerald-600">{note}</div>
    </Card>
  );
}
