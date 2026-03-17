import { z } from "zod";

export const resultReviewerActionSchema = z.object({
  resultSheetId: z.string().trim().min(1),
  comment: z.string().trim().optional(),
});