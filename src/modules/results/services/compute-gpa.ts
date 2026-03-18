import { prisma } from "@/lib/db/prisma";
import { computeAcademicStanding } from "./compute-academic-standing";

export async function computeGPA(studentProfileId: string, sessionId: string, semesterId: string) {
  const entries = await prisma.resultEntry.findMany({
    where: {
      studentProfileId,
      contributesToGPA: true,
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
  let carryoverCount = 0;

  for (const entry of entries) {
    const units = entry.resultSheet.offering.course.creditUnits;
    totalUnitsAttempted += units;
    totalGradePoints += (entry.gradePoint ?? 0) * units;

    if (entry.isPassed) {
      totalUnitsPassed += units;
    }

    if (entry.triggersCarryover) {
      carryoverCount += 1;
    }
  }

  const gpa = totalUnitsAttempted === 0 ? 0 : totalGradePoints / totalUnitsAttempted;
  const academicStanding = computeAcademicStanding(gpa, carryoverCount);

  return {
    totalUnitsAttempted,
    totalUnitsPassed,
    totalGradePoints,
    gpa,
    academicStanding,
    carryoverCount,
  };
}