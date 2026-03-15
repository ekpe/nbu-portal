import { z } from "zod";

export const departmentSchema = z.object({
  facultyId: z.string().trim().min(1, "Faculty is required"),
  code: z.string().trim().min(2, "Code is required").max(20),
  name: z.string().trim().min(2, "Name is required").max(150),
  description: z.string().trim().optional(),
  isActive: z.coerce.boolean().default(true),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;