"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { recomputeStudentFinanceBalance } from "@/modules/finance/services/recompute-student-finance-balance";

export async function releaseFinanceHoldAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const holdId = String(formData.get("holdId") ?? "");
  if (!holdId) throw new Error("Hold ID is required.");

  const hold = await prisma.financeHold.findUnique({
    where: { id: holdId },
  });

  if (!hold) throw new Error("Finance hold not found.");

  const updated = await prisma.financeHold.update({
    where: { id: holdId },
    data: {
      isActive: false,
      releasedByUserId: session.user.id,
      releasedAt: new Date(),
    },
  });

  await recomputeStudentFinanceBalance(hold.studentProfileId);

  await writeAuditLog({
    actorId: session.user.id,
    action: "FINANCE_HOLD_RELEASED",
    entityType: "FINANCE_HOLD",
    entityId: updated.id,
    summary: `Released finance hold ${updated.holdType}`,
    beforeJson: hold,
    afterJson: updated,
  });
}