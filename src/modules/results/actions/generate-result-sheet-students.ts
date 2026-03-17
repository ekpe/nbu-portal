"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { listRegisteredStudentsForOffering } from "@/modules/results/services/list-registered-students-for-offering";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function generateResultSheetStudentsAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const resultSheetId = String(formData.get("resultSheetId") ?? "");
  if (!resultSheetId) throw new Error("Result sheet is required.");

  const sheet = await prisma.resultSheet.findUnique({
    where: { id: resultSheetId },
  });

  if (!sheet) throw new Error("Result sheet not found.");
  if (sheet.status !== "DRAFT") throw new Error("Only draft sheets can be generated.");

  const students = await listRegisteredStudentsForOffering(sheet.courseOfferingId);

  for (const row of students) {
    const exists = await prisma.resultEntry.findFirst({
      where: {
        resultSheetId,
        studentProfileId: row.studentProfile.id,
      },
    });

    if (!exists) {
      await prisma.resultEntry.create({
        data: {
          resultSheetId,
          studentProfileId: row.studentProfile.id,
          registrationId: row.registrationId,
        },
      });
    }
  }

  await prisma.resultSheet.update({
    where: { id: resultSheetId },
    data: {
      numberOfStudents: students.length,
      numberRegisteredStudents: students.length,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "RESULT_STUDENTS_GENERATED",
    entityType: "RESULT_SHEET",
    entityId: resultSheetId,
    summary: `Generated result entries for ${students.length} students`,
  });
}