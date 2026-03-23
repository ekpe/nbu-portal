"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { financeHoldSchema } from "@/modules/finance/validators/finance-hold-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { recomputeStudentFinanceBalance } from "@/modules/finance/services/recompute-student-finance-balance";

export async function placeFinanceHoldAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = financeHoldSchema.safeParse({
    studentProfileId: formData.get("studentProfileId"),
    holdType: formData.get("holdType"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid finance hold.");
  }

  const financeAccount = await prisma.studentFinanceAccount.findUnique({
    where: { studentProfileId: parsed.data.studentProfileId },
  });

  if (!financeAccount) {
    throw new Error("Student finance account not found.");
  }

  const hold = await prisma.financeHold.create({
    data: {
      studentFinanceAccountId: financeAccount.id,
      studentProfileId: parsed.data.studentProfileId,
      holdType: parsed.data.holdType,
      reason: parsed.data.reason,
      isActive: true,
      placedByUserId: session.user.id,
    },
  });

  await recomputeStudentFinanceBalance(parsed.data.studentProfileId);

  await writeAuditLog({
    actorId: session.user.id,
    action: "FINANCE_HOLD_PLACED",
    entityType: "FINANCE_HOLD",
    entityId: hold.id,
    summary: `Placed finance hold: ${hold.holdType}`,
    afterJson: hold,
  });
}