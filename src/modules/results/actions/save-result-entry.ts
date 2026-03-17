"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { computeGrade } from "@/modules/results/services/compute-grade";
import { emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function saveResultEntryAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const entryId = String(formData.get("entryId") ?? "");
  if (!entryId) throw new Error("Result entry is required.");

  const entry = await prisma.resultEntry.findUnique({
    where: { id: entryId },
    include: {
      resultSheet: true,
    },
  });

  if (!entry) throw new Error("Result entry not found.");
  if (entry.resultSheet.status !== "DRAFT") throw new Error("Only draft entries can be edited.");

  const caScore = Number(emptyToUndefined(formData.get("caScore")) ?? 0);
  const examScore = Number(emptyToUndefined(formData.get("examScore")) ?? 0);

  const q1Score = emptyToUndefined(formData.get("q1Score"));
  const q2Score = emptyToUndefined(formData.get("q2Score"));
  const q3Score = emptyToUndefined(formData.get("q3Score"));
  const q4Score = emptyToUndefined(formData.get("q4Score"));
  const q5Score = emptyToUndefined(formData.get("q5Score"));
  const q6Score = emptyToUndefined(formData.get("q6Score"));
  const q7Score = emptyToUndefined(formData.get("q7Score"));

  const totalScore = caScore + examScore;
  const grade = computeGrade(totalScore);

  const before = await prisma.resultEntry.findUnique({
    where: { id: entryId },
  });

  const updated = await prisma.resultEntry.update({
    where: { id: entryId },
    data: {
      caScore,
      examScore,
      totalScore,
      letterGrade: grade.letterGrade,
      gradePoint: grade.gradePoint,
      remark: grade.remark,
      q1Score: q1Score ? Number(q1Score) : null,
      q2Score: q2Score ? Number(q2Score) : null,
      q3Score: q3Score ? Number(q3Score) : null,
      q4Score: q4Score ? Number(q4Score) : null,
      q5Score: q5Score ? Number(q5Score) : null,
      q6Score: q6Score ? Number(q6Score) : null,
      q7Score: q7Score ? Number(q7Score) : null,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "RESULT_ENTRY_SAVED",
    entityType: "RESULT_ENTRY",
    entityId: updated.id,
    summary: "Saved result entry",
    beforeJson: before,
    afterJson: updated,
  });
}