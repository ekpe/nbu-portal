import { z } from "zod";

export const financeHoldSchema = z.object({
  studentProfileId: z.string().trim().min(1),
  holdType: z.string().trim().min(1),
  reason: z.string().trim().min(5),
});