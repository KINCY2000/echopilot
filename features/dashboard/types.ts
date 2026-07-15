export type ReviewSentiment = "Positif" | "Négatif" | "Mitigé";
export type ReviewStatus = "Répondu" | "En attente";

export type Review = {
  id: number;
  name: string;
  initials: string;
  rating: 1 | 2 | 3 | 4 | 5;
  time: string;
  text: string;
  status: ReviewStatus;
  tags: string[];
  sentiment: ReviewSentiment;
};

export type ResponseTone = "Chaleureux" | "Professionnel" | "Premium" | "Dynamique";

export type RatingTrendPoint = {
  day: string;
  note: number;
};

export type RatingDistributionSlice = {
  name: string;
  value: number;
};
