import { prisma } from "@/lib/db/prisma";
import { computeGrade } from "./compute-grade";
import { toNullableNumber, toTrimmedString } from "./import-result-helpers";
import { getColumnValue, HEADER_ALIASES } from "./import-column-map";

export async function importResultSheet(
  resultSheetId: string,
  rows: Record<string, unknown>[],
): Promise<void> {
  for (const row of rows) {
    const matricNumber = toTrimmedString(
      getColumnValue(row, HEADER_ALIASES.matricNumber),
    );
    if (!matricNumber) continue;

    const student = await prisma.studentProfile.findUnique({
      where: { matricNumber },
    });

    if (!student) continue;

    const caScore =
      toNullableNumber(getColumnValue(row, HEADER_ALIASES.caScore)) ?? 0;
    const examScore =
      toNullableNumber(getColumnValue(row, HEADER_ALIASES.examScore)) ?? 0;
    const totalScore =
      toNullableNumber(getColumnValue(row, HEADER_ALIASES.totalScore)) ??
      caScore + examScore;

    const grade = computeGrade(totalScore);

    const existing = await prisma.resultEntry.findFirst({
      where: {
        resultSheetId,
        studentProfileId: student.id,
      },
    });

    if (existing) {
      await prisma.resultEntry.update({
        where: { id: existing.id },
        data: {
          caScore,
          examScore,
          totalScore,
          letterGrade: grade.letterGrade,
          gradePoint: grade.gradePoint,
          remark: grade.remark,
          isPassed: grade.isPassed,
          triggersCarryover: grade.triggersCarryover,
        },
      });
    } else {
      await prisma.resultEntry.create({
        data: {
          resultSheetId,
          studentProfileId: student.id,
          caScore,
          examScore,
          totalScore,
          letterGrade: grade.letterGrade,
          gradePoint: grade.gradePoint,
          remark: grade.remark,
          isPassed: grade.isPassed,
          triggersCarryover: grade.triggersCarryover,
        },
      });
    }
  }
}