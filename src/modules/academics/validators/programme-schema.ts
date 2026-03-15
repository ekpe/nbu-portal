import { z } from "zod";

export const programmeSchema = z.object({
  facultyId: z.string().trim().min(1, "Faculty is required"),
  departmentId: z.string().trim().min(1, "Department is required"),
  code: z.string().trim().min(2, "Code is required").max(30),
  name: z.string().trim().min(2, "Name is required").max(150),
  awardType: z.string().trim().optional(),
  durationYears: z.coerce.number().int().min(1).max(10).optional(),
  isActive: z.coerce.boolean().default(true),
});

export type ProgrammeInput = z.infer<typeof programmeSchema>;