"use client";

import { RefreshCw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Review, ResponseTone } from "@/features/dashboard/types";

const TONES: ResponseTone[] = ["Chaleureux", "Professionnel", "Premium", "Dynamique"];

export function AiResponseGenerator({
  review,
  tone,
  onToneChange,
  response,
  published,
  onRegenerate,
  onPublish,
}: {
  review: Review;
  tone: ResponseTone;
  onToneChange: (tone: ResponseTone) => void;
  response: string;
  published: boolean;
  onRegenerate: () => void;
  onPublish: () => void;
}) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 font-bold">Générer une réponse</h3>

      <Label htmlFor="response-tone">Ton de la réponse</Label>
      <Select value={tone} onValueChange={(value) => onToneChange(value as ResponseTone)}>
        <SelectTrigger id="response-tone" className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TONES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea key={review.id} defaultValue={response} className="mt-3 h-72" />

      <div className="mt-4 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onRegenerate}>
          <RefreshCw size={17} />
          Régénérer
        </Button>
        <Button className="flex-[1.4]" onClick={onPublish}>
          <Send size={17} />
          {published ? "Réponse publiée" : "Publier la réponse"}
        </Button>
      </div>

      {published && (
        <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700">
          ✓ Simulation réussie : la réponse est marquée comme publiée.
        </div>
      )}
    </div>
  );
}
