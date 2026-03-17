import { prisma } from "@/lib/db/prisma";

export async function computeCGPA(studentProfileId: string) {
  const gpas = await prisma.gPARecord.findMany({
    where: { studentProfileId },
  });

  const totalCumulativeUnits = gpas.reduce((sum, row) => sum + row.totalUnitsAttempted, 0);
  const totalCumulativeGradePoints = gpas.reduce((sum, row) => sum + row.totalGradePoints, 0);
  const cgpa =
    totalCumulativeUnits === 0 ? 0 : totalCumulativeGradePoints / totalCumulativeUnits;

  return {
    totalCumulativeUnits,
    totalCumulativeGradePoints,
    cgpa,
  };
}