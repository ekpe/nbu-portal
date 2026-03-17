import { prisma } from "@/lib/db/prisma";

export async function listAvailableCourseOfferingsForStudent(
  facultyId: string,
  departmentId: string,
  programmeId: string,
  levelId: string,
  sessionId: string,
  semesterId: string,
) {
  return prisma.courseOffering.findMany({
    where: {
      sessionId,
      semesterId,
      facultyId,
      departmentId,
      isActive: true,
      OR: [
        { programmeId: null },
        { programmeId },
      ],
      AND: [
        {
          OR: [{ levelId: null }, { levelId }],
        },
      ],
    },
    include: {
      course: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}