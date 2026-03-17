"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { resultSheetSubmitSchema } from "@/modules/results/validators/result-sheet-submit-schema";
import { validateResultSheet } from "@/modules/results/services/validate-result-sheet";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function submitResultSheetAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = resultSheetSubmitSchema.safeParse({
    resultSheetId: formData.get("resultSheetId"),
  });

  if (!parsed.success) throw new Error("Result sheet ID is required.");

  const sheet = await prisma.resultSheet.findUnique({
    where: { id: parsed.data.resultSheetId },
  });

  if (!sheet) throw new Error("Result sheet not found.");
  if (sheet.status !== "DRAFT") throw new Error("Only draft result sheets can be submitted.");

  const validation = await validateResultSheet(sheet.id);
  if (!validation.valid) {
    throw new Error(validation.errors[0] ?? "Result sheet validation failed.");
  }

  const updated = await prisma.resultSheet.update({
    where: { id: sheet.id },
    data: {
      status: "LECTURER_SUBMITTED",
      submittedAt: new Date(),
    },
  });

  await prisma.resultApprovalAction.create({
    data: {
      resultSheetId: updated.id,
      actorUserId: session.user.id,
      actionType: "SUBMIT",
      fromStatus: "DRAFT",
      toStatus: "LECTURER_SUBMITTED",
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "RESULT_SHEET_SUBMITTED",
    entityType: "RESULT_SHEET",
    entityId: updated.id,
    summary: "Submitted result sheet",
    beforeJson: sheet,
    afterJson: updated,
  });

  redirect(`/staff/results/${updated.id}`);
}