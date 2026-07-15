"use client";

import { Sparkles, TrendingUp, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AiResponseGenerator } from "@/features/dashboard/components/ai-response-generator";
import { Stars } from "@/features/dashboard/components/stars";
import { useMockAiResponse } from "@/features/dashboard/hooks/use-mock-ai-response";
import type { Review, ResponseTone } from "@/features/dashboard/types";

export function ReviewDetailPanel({
  review,
  tone,
  onToneChange,
  published,
  onRegenerate,
  onPublish,
}: {
  review: Review;
  tone: ResponseTone;
  onToneChange: (tone: ResponseTone) => void;
  published: boolean;
  onRegenerate: () => void;
  onPublish: () => void;
}) {
  const response = useMockAiResponse(review);

  return (
    <aside className="w-full border-l border-border bg-card p-5 lg:w-[390px]">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="font-bold">Avis sélectionné</h2>
        <X size={20} className="text-slate-500" />
      </div>

      <div className="py-5">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback>{review.initials}</AvatarFallback>
          </Avatar>
          <div>
            <b>{review.name}</b>
            <Stars rating={review.rating} />
          </div>
          <span className="ml-auto text-xs text-slate-500">{review.time}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700">{review.text}</p>
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
        <div className="mb-3 flex items-center gap-2 font-semibold text-indigo-700">
          <Sparkles size={18} />
          Analyse IA
        </div>
        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs text-indigo-700">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-600">
          Sentiment global :{" "}
          <b className={review.sentiment === "Positif" ? "text-emerald-600" : "text-red-600"}>{review.sentiment}</b>
        </div>
      </div>

      <AiResponseGenerator
        review={review}
        tone={tone}
        onToneChange={onToneChange}
        response={response}
        published={published}
        onRegenerate={onRegenerate}
        onPublish={onPublish}
      />

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center gap-2 font-semibold">
          <TrendingUp size={18} className="text-indigo-600" />
          Conseil du jour
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          Répondez aux avis négatifs en moins de 24 heures pour montrer que vous prenez chaque retour au sérieux.
        </p>
      </div>
    </aside>
  );
}
