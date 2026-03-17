"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { reviewerActionSchema } from "@/modules/registration/validators/reviewer-action-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function approveRegistrationAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = reviewerActionSchema.safeParse({
    registrationId: formData.get("registrationId"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    throw new Error("Registration ID is required.");
  }

  const registration = await prisma.courseRegistration.findUnique({
    where: { id: parsed.data.registrationId },
  });

  if (!registration) throw new Error("Registration not found.");
  if (registration.status !== "SUBMITTED") throw new Error("Only submitted registrations can be approved.");

  const updated = await prisma.courseRegistration.update({
    where: { id: registration.id },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      updatedByUserId: session.user.id,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "REGISTRATION_APPROVED",
    entityType: "COURSE_REGISTRATION",
    entityId: updated.id,
    summary: parsed.data.comment?.trim()
      ? `Approved registration. Comment: ${parsed.data.comment}`
      : "Approved registration",
    beforeJson: registration,
    afterJson: updated,
  });

  redirect("/staff/registration-queue");
}