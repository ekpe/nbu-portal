import { z } from "zod";

export const resultAmendmentSchema = z.object({
  resultSheetId: z.string().trim().min(1),
  reason: z.string().trim().min(10, "Reason must be at least 10 characters."),
});