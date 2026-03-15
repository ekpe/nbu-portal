import { z } from "zod";

export const sessionSchema = z.object({
  name: z.string().trim().min(4, "Session name is required").max(20),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.coerce.boolean().default(true),
  isCurrent: z.coerce.boolean().default(false),
});

export type SessionInput = z.infer<typeof sessionSchema>;;