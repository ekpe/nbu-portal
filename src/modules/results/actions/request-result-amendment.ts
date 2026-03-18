"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { resultAmendmentSchema } from "@/modules/results/validators/result-amendment-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function requestResultAmendmentAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = resultAmendmentSchema.safeParse({
    resultSheetId: formData.get("resultSheetId"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Invalid amendment request.",
    );
  }

  const request = await prisma.resultAmendmentRequest.create({
    data: {
      resultSheetId: parsed.data.resultSheetId,
      requestedByUserId: session.user.id,
      reason: parsed.data.reason,
      status: "PENDING",
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "RESULT_AMENDMENT_REQUESTED",
    entityType: "RESULT_AMENDMENT_REQUEST",
    entityId: request.id,
    summary: "Requested result amendment",
    afterJson: request,
  });
}