import { z } from "zod";

export const reviewerActionSchema = z.object({
  registrationId: z.string().trim().min(1),
  comment: z.string().trim().optional(),
});