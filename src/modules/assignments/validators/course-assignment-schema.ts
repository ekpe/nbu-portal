import { z } from "zod";

export const courseAssignmentSchema = z.object({
  courseOfferingId: z.string().trim().min(1),
  lecturerStaffProfileId: z.string().trim().min(1),
  isPrimary: z.coerce.boolean().default(true),
  isActive: z.coerce.boolean().default(true),
});