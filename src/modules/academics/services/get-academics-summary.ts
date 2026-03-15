import { prisma } from "@/lib/db/prisma";

export async function getAcademicsSummary() {
  const [faculties, departments, programmes, levels, sessions, semesters] =
    await Promise.all([
      prisma.faculty.count(),
      prisma.department.count(),
      prisma.programme.count(),
      prisma.level.count(),
      prisma.academicSession.count(),
      prisma.semester.count(),
    ]);

  return {
    faculties,
    departments,
    programmes,
    levels,
    sessions,
    semesters,
  };
}