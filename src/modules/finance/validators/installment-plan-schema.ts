import { z } from "zod";

export const installmentPlanSchema = z.object({
  studentProfileId: z.string().trim().min(1),
  sessionId: z.string().trim().min(1),
  semesterId: z.string().trim().min(1),
  totalAmountDue: z.coerce.number().positive(),
  minimumRequiredToRegister: z.coerce.number().nonnegative(),
});