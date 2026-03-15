import { z } from "zod";

export const courseOfferingSchema = z.object({
  courseId: z.string().trim().min(1),
  sessionId: z.string().trim().min(1),
  semesterId: z.string().trim().min(1),
  facultyId: z.string().trim().min(1),
  departmentId: z.string().trim().min(1),
  programmeId: z.string().trim().optional(),
  levelId: z.string().trim().optional(),
  registrationCap: z.coerce.number().int().min(1).optional(),
  isActive: z.coerce.boolean().default(true),
});