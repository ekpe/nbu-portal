import { z } from "zod";

export const financeOverrideSchema = z.object({
  studentProfileId: z.string().trim().min(1),
  requestType: z.string().trim().min(1),
  reason: z.string().trim().min(10),
});