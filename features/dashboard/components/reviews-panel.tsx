"use client";

import { MoreVertical } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Stars } from "@/features/dashboard/components/stars";
import type { Review } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

export function ReviewsPanel({
  reviews,
  selectedId,
  onSelect,
}: {
  reviews: Review[];
  selectedId: number;
  onSelect: (review: Review) => void;
}) {
  return (
    <Card className="overflow-hidden py-0">
      <div className="flex items-center justify-between border-b border-border p-5">
        <h2 className="font-bold">Avis récents</h2>
        <button className="text-sm font-semibold text-indigo-600">Voir tous les avis →</button>
      </div>
      {reviews.map((review) => (
        <button
          key={review.id}
          onClick={() => onSelect(review)}
          className={cn(
            "flex w-full flex-col gap-3 border-b border-border p-5 text-left last:border-0 hover:bg-slate-50 md:flex-row md:items-center",
            selectedId === review.id && "bg-indigo-50/60"
          )}
        >
          <Avatar className="size-11 shrink-0">
            <AvatarFallback className="text-xs">{review.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <b>{review.name}</b>
              <Stars rating={review.rating} />
              <span className="text-xs text-slate-500">{review.time}</span>
            </div>
            <p className="mt-1 truncate text-sm text-slate-600">{review.text}</p>
          </div>
          <Badge variant={review.status === "Répondu" ? "success" : "warning"}>{review.status}</Badge>
          <MoreVertical size={18} className="text-slate-400" />
        </button>
      ))}
    </Card>
  );
}
