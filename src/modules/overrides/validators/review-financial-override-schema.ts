import { z } from "zod";

export const reviewFinancialOverrideSchema = z.object({
  overrideId: z.string().cuid(),
});