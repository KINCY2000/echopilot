"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";
import { mockRatingTrend } from "@/features/dashboard/data/mock-reviews";

export function RatingTrendChart() {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-bold">Évolution de la note</h2>
        <span className="text-xs text-slate-500">7 derniers jours</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockRatingTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis domain={[3.5, 5]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="note" stroke="#4f5df5" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
