"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { getCurrentStudentRegistrationContext } from "@/modules/registration/services/get-current-student-registration-context";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { checkStudentRegistrationFinanceClearance } from "@/modules/finance/services/check-student-registration-finance-clearance";

export async function createRegistrationDraftAction(): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const context = await getCurrentStudentRegistrationContext(session.user.id);

  if (!context?.studentProfile || !context.session || !context.semester || !context.enrollment) {
    throw new Error("Student registration context is incomplete.");
  }

  const financeValidation = await checkStudentRegistrationFinanceClearance(
    context.studentProfile.id,
  );

  if (!financeValidation.cleared) {
    throw new Error(
      financeValidation.errors[0] ?? "Finance clearance validation failed.",
    );
  }

  const existingDraft = await prisma.courseRegistration.findFirst({
    where: {
      studentProfileId: context.studentProfile.id,
      sessionId: context.session.id,
      semesterId: context.semester.id,
      status: "DRAFT",
    },
  });

  if (existingDraft) {
    redirect(`/student/registration/${existingDraft.id}`);
  }

  const registration = await prisma.courseRegistration.create({
    data: {
      studentProfileId: context.studentProfile.id,
      sessionId: context.session.id,
      semesterId: context.semester.id,
      enrollmentId: context.enrollment.id,
      status: "DRAFT",
      totalCredits: 0,
      createdByUserId: session.user.id,
      updatedByUserId: session.user.id,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "REGISTRATION_DRAFT_CREATED",
    entityType: "COURSE_REGISTRATION",
    entityId: registration.id,
    summary: "Created registration draft",
    afterJson: registration,
  });

  redirect(`/student/registration/${registration.id}`);
}