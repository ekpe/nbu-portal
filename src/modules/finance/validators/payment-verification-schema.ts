import { z } from "zod";

export const paymentVerificationSchema = z.object({
  paymentTransactionId: z.string().trim().min(1),
});