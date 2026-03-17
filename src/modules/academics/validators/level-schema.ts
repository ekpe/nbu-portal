import { z } from "zod";

export const levelSchema = z.object({
  code: z.string().trim().min(1, "Code is required").max(20),
  name: z.string().trim().min(2, "Name is required").max(100),
  numericValue: z.coerce.number().int().min(1),
  isActive: z.coerce.boolean().default(true),
});

export type LevelInput = z.infer<typeof levelSchema>;