"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { resultReviewerActionSchema } from "@/modules/results/validators/reviewer-action-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function approveResultSheetAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = resultReviewerActionSchema.safeParse({
    resultSheetId: formData.get("resultSheetId"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) throw new Error("Result sheet ID is required.");

  const sheet = await prisma.resultSheet.findUnique({
    where: { id: parsed.data.resultSheetId },
  });

  if (!sheet) throw new Error("Result sheet not found.");
  if (sheet.status !== "LECTURER_SUBMITTED") throw new Error("Only submitted sheets can be approved.");

  const updated = await prisma.resultSheet.update({
    where: { id: sheet.id },
    data: {
      status: "DEAN_APPROVED",
      approvedAt: new Date(),
    },
  });

  await prisma.resultApprovalAction.create({
    data: {
      resultSheetId: updated.id,
      actorUserId: session.user.id,
      actionType: "APPROVE",
      fromStatus: sheet.status,
      toStatus: "DEAN_APPROVED",
      comment: parsed.data.comment,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "RESULT_SHEET_APPROVED",
    entityType: "RESULT_SHEET",
    entityId: updated.id,
    summary: parsed.data.comment?.trim()
      ? `Approved result sheet. Comment: ${parsed.data.comment}`
      : "Approved result sheet",
    beforeJson: sheet,
    afterJson: updated,
  });

  redirect("/admin/results/review-queue");
}