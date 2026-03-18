import { prisma } from "@/lib/db/prisma";
import { computeGrade } from "./compute-grade";
import { toNullableNumber, toTrimmedString } from "./import-result-helpers";
import { getColumnValue, HEADER_ALIASES } from "./import-column-map";

export async function importMasterSheet(
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

    const q1Score = toNullableNumber(getColumnValue(row, HEADER_ALIASES.q1));
    const q2Score = toNullableNumber(getColumnValue(row, HEADER_ALIASES.q2));
    const q3Score = toNullableNumber(getColumnValue(row, HEADER_ALIASES.q3));
    const q4Score = toNullableNumber(getColumnValue(row, HEADER_ALIASES.q4));
    const q5Score = toNullableNumber(getColumnValue(row, HEADER_ALIASES.q5));
    const q6Score = toNullableNumber(getColumnValue(row, HEADER_ALIASES.q6));
    const q7Score = toNullableNumber(getColumnValue(row, HEADER_ALIASES.q7));

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
          q1Score,
          q2Score,
          q3Score,
          q4Score,
          q5Score,
          q6Score,
          q7Score,
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
          q1Score,
          q2Score,
          q3Score,
          q4Score,
          q5Score,
          q6Score,
          q7Score,
        },
      });
    }
  }
}