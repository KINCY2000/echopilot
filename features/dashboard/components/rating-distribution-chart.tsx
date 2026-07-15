"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card } from "@/components/ui/card";
import { mockRatingDistribution, ratingDistributionColors } from "@/features/dashboard/data/mock-reviews";

export function RatingDistributionChart() {
  return (
    <Card className="p-5">
      <h2 className="mb-3 font-bold">Répartition des avis</h2>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={mockRatingDistribution} dataKey="value" innerRadius={48} outerRadius={78}>
              {mockRatingDistribution.map((_, i) => (
                <Cell key={i} fill={ratingDistributionColors[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {mockRatingDistribution.map((slice, i) => (
          <div key={slice.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: ratingDistributionColors[i] }} />
            <span>{slice.name}</span>
            <b className="ml-auto">{slice.value}%</b>
          </div>
        ))}
      </div>
    </Card>
  );
}
