import { z } from "zod";

export const resultEntrySchema = z.object({
  studentProfileId: z.string().trim().min(1),
  caScore: z.coerce.number().min(0).max(30).optional(),
  examScore: z.coerce.number().min(0).max(70).optional(),
  q1Score: z.coerce.number().min(0).max(100).optional(),
  q2Score: z.coerce.number().min(0).max(100).optional(),
  q3Score: z.coerce.number().min(0).max(100).optional(),
  q4Score: z.coerce.number().min(0).max(100).optional(),
  q5Score: z.coerce.number().min(0).max(100).optional(),
  q6Score: z.coerce.number().min(0).max(100).optional(),
  q7Score: z.coerce.number().min(0).max(100).optional(),
});