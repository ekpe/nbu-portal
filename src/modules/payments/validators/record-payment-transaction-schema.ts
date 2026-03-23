import { z } from "zod";

export const recordPaymentTransactionSchema = z.object({
  studentProfileId: z.string().cuid(),
  sessionId: z.string().cuid(),
  semesterId: z.string().cuid(),
  amount: z.coerce.number().positive(),
  paymentChannel: z.string().min(1).max(50).optional().nullable(),
  paymentProvider: z.string().min(1).max(100).optional().nullable(),
  transactionReference: z.string().min(3).max(100),
  receiptNumber: z.string().min(3).max(100).optional().nullable(),
  paymentDate: z.coerce.date(),
});