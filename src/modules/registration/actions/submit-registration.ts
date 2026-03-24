"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { validateRegistration } from "@/modules/registration/services/validate-registration";
import { registrationSubmitSchema } from "@/modules/registration/validators/registration-submit-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { validateRegistrationCarryoverRules } from "@/modules/registration/services/validate-registration-carryover-rules";
import { checkStudentRegistrationFinanceClearance } from "@/modules/finance/services/check-student-registration-finance-clearance";
import { checkStudentInstallmentClearance } from "@/modules/finance/services/check-student-installment-clearance";

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

  const carryoverValidation = await validateRegistrationCarryoverRules(registration.id);

  if (!carryoverValidation.valid) {
    throw new Error(carryoverValidation.errors[0] ?? "Carryover validation failed.");
  }

  const financeValidation = await checkStudentRegistrationFinanceClearance(
    registration.studentProfileId,
  );

  if (!financeValidation.cleared) {
    throw new Error(
      financeValidation.errors[0] ?? "Finance clearance validation failed.",
    );
  }

  const installmentValidation = await checkStudentInstallmentClearance(
    registration.studentProfileId,
    registration.sessionId,
    registration.semesterId,
  );

  if (!installmentValidation.allowed) {
    throw new Error(
      installmentValidation.errors[0] ?? "Installment validation failed.",
    );
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