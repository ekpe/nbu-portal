"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { calculateRegistrationCredits } from "@/modules/registration/services/calculate-registration-credits";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function addCourseToRegistrationAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const registrationId = String(formData.get("registrationId") ?? "");
  const courseOfferingId = String(formData.get("courseOfferingId") ?? "");

  if (!registrationId || !courseOfferingId) {
    throw new Error("Registration and course offering are required.");
  }

  const registration = await prisma.courseRegistration.findUnique({
    where: { id: registrationId },
    include: { studentProfile: true },
  });

  if (!registration) throw new Error("Registration not found.");
  if (registration.status !== "DRAFT") throw new Error("Only draft registrations can be edited.");
  if (registration.studentProfile.userId !== session.user.id) throw new Error("Unauthorized.");

  const offering = await prisma.courseOffering.findUnique({
    where: { id: courseOfferingId },
    include: { course: true },
  });

  if (!offering) throw new Error("Course offering not found.");

  const existing = await prisma.courseRegistrationItem.findFirst({
    where: {
      registrationId,
      courseId: offering.course.id,
    },
  });

  if (existing) {
    throw new Error("Course already added to registration.");
  }

  const item = await prisma.courseRegistrationItem.create({
    data: {
      registrationId,
      courseOfferingId: offering.id,
      courseId: offering.course.id,
      creditUnits: offering.course.creditUnits,
      itemType: "NORMAL",
      isCarryover: false,
    },
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
    action: "REGISTRATION_ITEM_ADDED",
    entityType: "COURSE_REGISTRATION",
    entityId: registrationId,
    summary: `Added course ${offering.course.courseCode} to registration`,
    afterJson: item,
  });
}