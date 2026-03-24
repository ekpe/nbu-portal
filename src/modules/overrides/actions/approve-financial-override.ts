"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function approveFinancialOverrideAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const overrideId = String(formData.get("overrideId") ?? "").trim();

  if (!overrideId) {
    throw new Error("Override ID is required.");
  }

  const override = await prisma.financeOverrideRequest.findUnique({
    where: { id: overrideId },
  });

  if (!override) {
    throw new Error("Finance override request not found.");
  }

  if (override.status !== "PENDING") {
    throw new Error("Only pending override requests can be approved.");
  }

  const updatedOverride = await prisma.financeOverrideRequest.update({
    where: { id: overrideId },
    data: {
      status: "APPROVED",
      approvedByUserId: session.user.id,
      approvedAt: new Date(),
    },
  });

  const updatedAccount = await prisma.studentFinanceAccount.update({
    where: { id: override.studentFinanceAccountId },
    data: {
      isFinanciallyCleared: true,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "FINANCE_OVERRIDE_APPROVED",
    entityType: "FINANCE_OVERRIDE_REQUEST",
    entityId: updatedOverride.id,
    summary: "Approved finance override request",
    beforeJson: override,
    afterJson: {
      override: updatedOverride,
      account: updatedAccount,
    },
  });
}