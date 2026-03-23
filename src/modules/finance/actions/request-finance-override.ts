"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { financeOverrideSchema } from "@/modules/finance/validators/finance-override-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function requestFinanceOverrideAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = financeOverrideSchema.safeParse({
    studentProfileId: formData.get("studentProfileId"),
    requestType: formData.get("requestType"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid finance override request.");
  }

  const financeAccount = await prisma.studentFinanceAccount.findUnique({
    where: { studentProfileId: parsed.data.studentProfileId },
  });

  if (!financeAccount) {
    throw new Error("Student finance account not found.");
  }

  const request = await prisma.financeOverrideRequest.create({
    data: {
      studentFinanceAccountId: financeAccount.id,
      studentProfileId: parsed.data.studentProfileId,
      requestedByUserId: session.user.id,
      requestType: parsed.data.requestType,
      reason: parsed.data.reason,
      status: "PENDING",
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "FINANCE_OVERRIDE_REQUESTED",
    entityType: "FINANCE_OVERRIDE_REQUEST",
    entityId: request.id,
    summary: `Requested finance override ${request.requestType}`,
    afterJson: request,
  });
}