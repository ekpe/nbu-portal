"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { installmentPlanSchema } from "@/modules/finance/validators/installment-plan-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function createInstallmentPlanAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = installmentPlanSchema.safeParse({
    studentProfileId: formData.get("studentProfileId"),
    sessionId: formData.get("sessionId"),
    semesterId: formData.get("semesterId"),
    totalAmountDue: formData.get("totalAmountDue"),
    minimumRequiredToRegister: formData.get("minimumRequiredToRegister"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid installment plan.");
  }

  const plan = await prisma.installmentPlan.create({
    data: {
      studentProfileId: parsed.data.studentProfileId,
      sessionId: parsed.data.sessionId,
      semesterId: parsed.data.semesterId,
      totalAmountDue: parsed.data.totalAmountDue,
      minimumRequiredToRegister: parsed.data.minimumRequiredToRegister,
      approvedByUserId: session.user.id,
      approvedAt: new Date(),
      isActive: true,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "INSTALLMENT_PLAN_CREATED",
    entityType: "INSTALLMENT_PLAN",
    entityId: plan.id,
    summary: "Created installment plan",
    afterJson: plan,
  });
}