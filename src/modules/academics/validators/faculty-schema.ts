import { z } from "zod";

export const facultySchema = z.object({
  code: z.string().trim().min(2, "Code is required").max(20),
  name: z.string().trim().min(2, "Name is required").max(150),
  description: z.string().trim().optional(),
  isActive: z.coerce.boolean().default(true),
});

export type FacultyInput = z.infer<typeof facultySchema>;