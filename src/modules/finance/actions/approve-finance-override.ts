"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { createBulkNotifications } from "@/modules/notifications/services/create-bulk-notifications";

export async function approveFinanceOverrideAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) throw new Error("Override request ID is required.");

  const request = await prisma.financeOverrideRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) throw new Error("Finance override request not found.");
  if (request.status !== "PENDING") throw new Error("Only pending requests can be approved.");

  const updatedRequest = await prisma.financeOverrideRequest.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      approvedByUserId: session.user.id,
      approvedAt: new Date(),
    },
  });

  const updatedAccount = await prisma.studentFinanceAccount.update({
    where: { id: request.studentFinanceAccountId },
    data: {
      isFinanciallyCleared: true,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "FINANCE_OVERRIDE_APPROVED",
    entityType: "FINANCE_OVERRIDE_REQUEST",
    entityId: updatedRequest.id,
    summary: "Approved finance override request",
    beforeJson: request,
    afterJson: { request: updatedRequest, account: updatedAccount },
  });

  await createBulkNotifications({
    userIds: [request.studentProfileId ? (await prisma.studentProfile.findUnique({
      where: { id: request.studentProfileId },
      select: { userId: true },
    }))?.userId ?? "" : ""].filter(Boolean),
    title: "Finance override approved",
    message: "Your finance override request has been approved.",
  });
}