import { z } from "zod";

export const semesterSchema = z.object({
  code: z.string().trim().min(2, "Code is required").max(20),
  name: z.string().trim().min(2, "Name is required").max(100),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.coerce.boolean().default(true),
  isCurrent: z.coerce.boolean().default(false),
});

export type SemesterInput = z.infer<typeof semesterSchema>;