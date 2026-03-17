import { getResultSheetById } from "./get-result-sheet-by-id";

export async function buildSummarySheet(resultSheetId: string) {
  const sheet = await getResultSheetById(resultSheetId);
  if (!sheet) throw new Error("Result sheet not found.");

  const counts = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
  };

  for (const entry of sheet.entries) {
    const grade = entry.letterGrade as keyof typeof counts | null;
    if (grade && counts[grade] !== undefined) {
      counts[grade] += 1;
    }
  }

  return {
    courseTitle: sheet.offering.course.title,
    courseCode: sheet.offering.course.courseCode,
    creditUnit: sheet.offering.course.creditUnits,
    counts,
    total: sheet.entries.length,
    nrs: sheet.numberRegisteredStudents ?? sheet.entries.length,
    courseLecturers: [sheet.lecturer.user.firstName, sheet.lecturer.user.lastName].join(" "),
  };
}