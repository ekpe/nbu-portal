"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { resultSheetSubmitSchema } from "@/modules/results/validators/result-sheet-submit-schema";
import { computeGPA } from "@/modules/results/services/compute-gpa";
import { computeCGPA } from "@/modules/results/services/compute-cgpa";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { rebuildTranscriptLedgerForStudent } from "@/modules/results/services/rebuild-transcript-ledger-for-student";

export async function publishResultSheetAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = resultSheetSubmitSchema.safeParse({
    resultSheetId: formData.get("resultSheetId"),
  });

  if (!parsed.success) throw new Error("Result sheet ID is required.");

  const sheet = await prisma.resultSheet.findUnique({
    where: { id: parsed.data.resultSheetId },
    include: {
      entries: true,
    },
  });

  if (!sheet) throw new Error("Result sheet not found.");
  if (sheet.status !== "DEAN_APPROVED") throw new Error("Only approved result sheets can be published.");

  const updated = await prisma.resultSheet.update({
    where: { id: sheet.id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  const studentIds = [...new Set(sheet.entries.map((e) => e.studentProfileId))];

  for (const studentProfileId of studentIds) {
    const gpa = await computeGPA(studentProfileId, sheet.sessionId, sheet.semesterId);

    await prisma.gPARecord.upsert({
      where: {
        id: `${studentProfileId}-${sheet.sessionId}-${sheet.semesterId}`,
      },
      update: {
        totalUnitsAttempted: gpa.totalUnitsAttempted,
        totalUnitsPassed: gpa.totalUnitsPassed,
        totalGradePoints: gpa.totalGradePoints,
        gpa: gpa.gpa,
        calculatedAt: new Date(),
      },
      create: {
        id: `${studentProfileId}-${sheet.sessionId}-${sheet.semesterId}`,
        studentProfileId,
        sessionId: sheet.sessionId,
        semesterId: sheet.semesterId,
        totalUnitsAttempted: gpa.totalUnitsAttempted,
        totalUnitsPassed: gpa.totalUnitsPassed,
        totalGradePoints: gpa.totalGradePoints,
        gpa: gpa.gpa,
      },
    });

    const cgpa = await computeCGPA(studentProfileId);

    await prisma.cGPARecord.upsert({
      where: {
        id: `${studentProfileId}-${sheet.sessionId}-${sheet.semesterId}`,
      },
      update: {
        totalCumulativeUnits: cgpa.totalCumulativeUnits,
        totalCumulativeGradePoints: cgpa.totalCumulativeGradePoints,
        cgpa: cgpa.cgpa,
        calculatedAt: new Date(),
      },
      create: {
        id: `${studentProfileId}-${sheet.sessionId}-${sheet.semesterId}`,
        studentProfileId,
        sessionId: sheet.sessionId,
        semesterId: sheet.semesterId,
        totalCumulativeUnits: cgpa.totalCumulativeUnits,
        totalCumulativeGradePoints: cgpa.totalCumulativeGradePoints,
        cgpa: cgpa.cgpa,
      },
    });
    await rebuildTranscriptLedgerForStudent(studentProfileId);
  }

  await prisma.resultApprovalAction.create({
    data: {
      resultSheetId: updated.id,
      actorUserId: session.user.id,
      actionType: "PUBLISH",
      fromStatus: sheet.status,
      toStatus: "PUBLISHED",
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "RESULT_SHEET_PUBLISHED",
    entityType: "RESULT_SHEET",
    entityId: updated.id,
    summary: "Published result sheet",
    beforeJson: sheet,
    afterJson: updated,
  });

  await createBulkNotifications({
    userIds: (
      await prisma.studentProfile.findMany({
        where: {
          id: { in: studentIds },
        },
        select: { userId: true },
      })
    ).map((s) => s.userId),
    title: "Results published",
    message: "A new published result is now available in your portal.",
  });

  redirect(`/admin/results/${updated.id}`);
}