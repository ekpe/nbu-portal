import { prisma } from "@/lib/db/prisma";

export async function computeGPA(studentProfileId: string, sessionId: string, semesterId: string) {
  const entries = await prisma.resultEntry.findMany({
    where: {
      studentProfileId,
      resultSheet: {
        sessionId,
        semesterId,
        status: "PUBLISHED",
      },
    },
    include: {
      resultSheet: {
        include: {
          offering: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  let totalUnitsAttempted = 0;
  let totalUnitsPassed = 0;
  let totalGradePoints = 0;

  for (const entry of entries) {
    const units = entry.resultSheet.offering.course.creditUnits;
    totalUnitsAttempted += units;
    totalGradePoints += (entry.gradePoint ?? 0) * units;

    if ((entry.gradePoint ?? 0) > 0) {
      totalUnitsPassed += units;
    }
  }

  const gpa = totalUnitsAttempted === 0 ? 0 : totalGradePoints / totalUnitsAttempted;

  return {
    totalUnitsAttempted,
    totalUnitsPassed,
    totalGradePoints,
    gpa,
  };
}