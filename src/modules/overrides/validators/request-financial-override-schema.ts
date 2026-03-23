import { z } from "zod";

export const requestFinancialOverrideSchema = z.object({
  studentProfileId: z.string().cuid(),
  sessionId: z.string().cuid(),
  semesterId: z.string().cuid(),
  reason: z.string().min(10).max(500),
  effectiveFrom: z.coerce.date().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
});