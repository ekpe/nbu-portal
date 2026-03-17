"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { calculateRegistrationCredits } from "@/modules/registration/services/calculate-registration-credits";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function removeCourseFromRegistrationAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) throw new Error("Registration item is required.");

  const item = await prisma.courseRegistrationItem.findUnique({
    where: { id: itemId },
    include: {
      registration: {
        include: {
          studentProfile: true,
        },
      },
      course: true,
    },
  });

  if (!item) throw new Error("Registration item not found.");
  if (item.registration.status !== "DRAFT") throw new Error("Only draft registrations can be edited.");
  if (item.registration.studentProfile.userId !== session.user.id) throw new Error("Unauthorized.");

  const registrationId = item.registrationId;

  await prisma.courseRegistrationItem.delete({
    where: { id: itemId },
  });

  const totalCredits = await calculateRegistrationCredits(registrationId);

  await prisma.courseRegistration.update({
    where: { id: registrationId },
    data: {
      totalCredits,
      updatedByUserId: session.user.id,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "REGISTRATION_ITEM_REMOVED",
    entityType: "COURSE_REGISTRATION",
    entityId: registrationId,
    summary: `Removed course ${item.course.courseCode} from registration`,
    beforeJson: item,
  });
}