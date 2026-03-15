import { z } from "zod";

export const courseSchema = z.object({
  courseCode: z.string().trim().min(2).max(30),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().optional(),
  creditUnits: z.coerce.number().int().min(1).max(12),
  facultyId: z.string().trim().min(1),
  departmentId: z.string().trim().min(1),
  programmeId: z.string().trim().optional(),
  levelId: z.string().trim().optional(),
  category: z.string().trim().min(1).default("CORE"),
  isCarryoverEligible: z.coerce.boolean().default(true),
  isElective: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});