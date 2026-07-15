import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom de votre entreprise doit contenir au moins 2 caractères")
    .max(120, "Le nom est trop long"),
});
