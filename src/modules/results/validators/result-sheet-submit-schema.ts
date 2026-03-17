import { z } from "zod";

export const resultSheetSubmitSchema = z.object({
  resultSheetId: z.string().trim().min(1),
});