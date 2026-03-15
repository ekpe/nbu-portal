import { z } from "zod";

export const adviserAssignmentSchema = z.object({
  staffProfileId: z.string().trim().min(1),
  facultyId: z.string().trim().min(1),
  departmentId: z.string().trim().optional(),
  programmeId: z.string().trim().optional(),
  levelId: z.string().trim().optional(),
  sessionId: z.string().trim().min(1),
  semesterId: z.string().trim().min(1),
  isActive: z.coerce.boolean().default(true),
});