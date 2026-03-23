import { z } from "zod";

export const paymentTransactionSchema = z.object({
  studentProfileId: z.string().trim().min(1),
  reference: z.string().trim().min(3),
  paymentChannel: z.string().trim().min(1),
  paymentSource: z.string().trim().optional(),
  paymentDate: z.string().trim().min(1),
  amount: z.coerce.number().positive(),
  currency: z.string().trim().default("NGN"),
  narration: z.string().trim().optional(),
  sessionId: z.string().trim().optional(),
  semesterId: z.string().trim().optional(),
});