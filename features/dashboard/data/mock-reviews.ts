/**
 * Temporary in-memory data for the dashboard prototype.
 *
 * This whole file is deleted in Module 4 (Google Business Profile sync) and
 * Module 7 (real dashboard data), once reviews are fetched from Supabase
 * instead of hard-coded here.
 */
import type { Review, RatingTrendPoint, RatingDistributionSlice } from "@/features/dashboard/types";

export const mockReviews: Review[] = [
  {
    id: 1,
    name: "Sophie L.",
    initials: "SL",
    rating: 5,
    time: "Il y a 2 heures",
    text: "Excellent repas, service au top et cadre très agréable. Nous reviendrons avec plaisir !",
    status: "Répondu",
    tags: ["Repas", "Service", "Cadre"],
    sentiment: "Positif",
  },
  {
    id: 2,
    name: "Julien D.",
    initials: "JD",
    rating: 2,
    time: "Il y a 5 heures",
    text: "Bon restaurant mais l'attente était un peu longue malgré la réservation.",
    status: "En attente",
    tags: ["Attente", "Service", "Réservation"],
    sentiment: "Négatif",
  },
  {
    id: 3,
    name: "Claire M.",
    initials: "CM",
    rating: 1,
    time: "Il y a 1 jour",
    text: "Déçue par la qualité des plats. Le prix est trop élevé pour ce que c'est.",
    status: "En attente",
    tags: ["Qualité", "Prix", "Plats"],
    sentiment: "Négatif",
  },
];

export const mockRatingTrend: RatingTrendPoint[] = [
  { day: "12 mai", note: 4.0 },
  { day: "13 mai", note: 4.2 },
  { day: "14 mai", note: 4.15 },
  { day: "15 mai", note: 4.4 },
  { day: "16 mai", note: 4.45 },
  { day: "17 mai", note: 4.48 },
  { day: "18 mai", note: 4.65 },
];

export const mockRatingDistribution: RatingDistributionSlice[] = [
  { name: "5 étoiles", value: 65 },
  { name: "4 étoiles", value: 20 },
  { name: "3 étoiles", value: 8 },
  { name: "2 étoiles", value: 4 },
  { name: "1 étoile", value: 3 },
];

export const ratingDistributionColors = ["#22c55e", "#86d36d", "#facc15", "#fb923c", "#ef4444"];
