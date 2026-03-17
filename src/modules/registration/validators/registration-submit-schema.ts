import { z } from "zod";

export const registrationSubmitSchema = z.object({
  registrationId: z.string().trim().min(1),
});