"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { reviewerActionSchema } from "@/modules/registration/validators/reviewer-action-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { createBulkNotifications } from "@/modules/notifications/services/create-bulk-notifications";

export async function approveRegistrationAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = reviewerActionSchema.safeParse({
    registrationId: formData.get("registrationId"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) throw new Error("Registration ID is required.");

  const registration = await prisma.courseRegistration.findUnique({
    where: { id: parsed.data.registrationId },
    include: {
      studentProfile: {
        include: { user: true },
      },
      enrollment: true,
    },
  });

  if (!registration) throw new Error("Registration not found.");

  let toStatus = registration.status;
  let actionType = "APPROVE";

  if (registration.status === "SUBMITTED") {
    toStatus = "ADVISER_APPROVED";
  } else if (registration.status === "ADVISER_APPROVED") {
    toStatus = "HOD_APPROVED";
  } else if (registration.status === "HOD_APPROVED") {
    toStatus = "DEAN_APPROVED";
  } else {
    throw new Error("This registration cannot be approved further.");
  }

  const updated = await prisma.courseRegistration.update({
    where: { id: registration.id },
    data: {
      status: toStatus,
      approvedAt: toStatus === "DEAN_APPROVED" ? new Date() : registration.approvedAt,
      hodApprovedAt: toStatus === "HOD_APPROVED" ? new Date() : registration.hodApprovedAt,
      deanApprovedAt: toStatus === "DEAN_APPROVED" ? new Date() : registration.deanApprovedAt,
      updatedByUserId: session.user.id,
    },
  });

  await prisma.registrationApprovalAction.create({
    data: {
      registrationId: updated.id,
      actorUserId: session.user.id,
      actionType,
      fromStatus: registration.status,
      toStatus,
      comment: parsed.data.comment,
    },
  });

  await createBulkNotifications({
    userIds: [registration.studentProfile.userId],
    title: "Registration updated",
    message: `Your registration moved from ${registration.status} to ${toStatus}.`,
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "REGISTRATION_APPROVED_STAGE",
    entityType: "COURSE_REGISTRATION",
    entityId: updated.id,
    summary: `Registration moved from ${registration.status} to ${toStatus}`,
    beforeJson: registration,
    afterJson: updated,
  });

  redirect("/staff/registration-queue");
}