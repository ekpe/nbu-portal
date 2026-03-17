"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { validateRegistration } from "@/modules/registration/services/validate-registration";
import { registrationSubmitSchema } from "@/modules/registration/validators/registration-submit-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function submitRegistrationAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = registrationSubmitSchema.safeParse({
    registrationId: formData.get("registrationId"),
  });

  if (!parsed.success) {
    throw new Error("Registration ID is required.");
  }

  const registration = await prisma.courseRegistration.findUnique({
    where: { id: parsed.data.registrationId },
    include: {
      studentProfile: true,
    },
  });

  if (!registration) throw new Error("Registration not found.");
  if (registration.status !== "DRAFT") throw new Error("Only draft registrations can be submitted.");
  if (registration.studentProfile.userId !== session.user.id) throw new Error("Unauthorized.");

  const validation = await validateRegistration(registration.id);

  if (!validation.valid) {
    throw new Error(validation.errors[0] ?? "Registration validation failed.");
  }

  const updated = await prisma.courseRegistration.update({
    where: { id: registration.id },
    data: {
      status: "SUBMITTED",
      totalCredits: validation.computedTotalCredits,
      submittedAt: new Date(),
      updatedByUserId: session.user.id,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "REGISTRATION_SUBMITTED",
    entityType: "COURSE_REGISTRATION",
    entityId: updated.id,
    summary: "Submitted course registration",
    afterJson: updated,
  });

  redirect(`/student/registration/${updated.id}`);
}