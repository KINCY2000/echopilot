import { useMemo } from "react";

import type { Review } from "@/features/dashboard/types";

/**
 * Produces a canned response for the prototype UI. Replaced in Module 6 by
 * a real OpenAI call (see roadmap: "Génération de réponse IA + publication").
 */
export function useMockAiResponse(review: Review) {
  return useMemo(() => {
    const firstName = review.name.split(" ")[0];
    const mainTopic = review.tags[0]?.toLowerCase() ?? "votre expérience";

    if (review.rating <= 2) {
      return `Bonjour ${firstName},\n\nMerci d'avoir pris le temps de partager votre avis. Nous sommes désolés que votre expérience n'ait pas pleinement répondu à vos attentes. Votre remarque concernant ${mainTopic} a bien été prise en compte et nous aide à améliorer notre service.\n\nNous espérons avoir l'occasion de vous accueillir de nouveau et de vous offrir une meilleure expérience.\n\nL'équipe du Bistrot Parisien`;
    }

    return `Bonjour ${firstName},\n\nMerci beaucoup pour votre message. Nous sommes ravis que vous ayez apprécié votre expérience chez nous. Vos encouragements font très plaisir à toute l'équipe.\n\nAu plaisir de vous accueillir à nouveau !\n\nL'équipe du Bistrot Parisien`;
  }, [review]);
}
