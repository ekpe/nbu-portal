"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function approveResultAmendmentAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const amendmentId = String(formData.get("amendmentId") ?? "");
  if (!amendmentId) throw new Error("Amendment ID is required.");

  const amendment = await prisma.resultAmendmentRequest.findUnique({
    where: { id: amendmentId },
  });

  if (!amendment) throw new Error("Amendment request not found.");
  if (amendment.status !== "PENDING") {
    throw new Error("Only pending requests can be approved.");
  }

  const updatedRequest = await prisma.resultAmendmentRequest.update({
    where: { id: amendmentId },
    data: {
      status: "APPROVED",
      approvedByUserId: session.user.id,
      approvedAt: new Date(),
    },
  });

  await prisma.resultSheet.update({
    where: { id: amendment.resultSheetId },
    data: {
      status: "DRAFT",
      publishedAt: null,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "RESULT_AMENDMENT_APPROVED",
    entityType: "RESULT_AMENDMENT_REQUEST",
    entityId: updatedRequest.id,
    summary: "Approved result amendment and reverted sheet to DRAFT",
    beforeJson: amendment,
    afterJson: updatedRequest,
  });
}