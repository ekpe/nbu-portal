import { prisma } from "@/lib/db/prisma";

export async function getAdviserQueue(userId: string) {
  const staffProfile = await prisma.staffProfile.findUnique({
    where: { userId },
  });

  if (!staffProfile) return [];

  const adviserAssignments = await prisma.adviserAssignment.findMany({
    where: {
      staffProfileId: staffProfile.id,
      isActive: true,
    },
  });

  if (adviserAssignments.length === 0) return [];

  return prisma.courseRegistration.findMany({
    where: {
      status: "SUBMITTED",
      OR: adviserAssignments.map((assignment) => ({
        enrollment: {
          facultyId: assignment.facultyId,
          departmentId: assignment.departmentId ?? undefined,
          programmeId: assignment.programmeId ?? undefined,
          levelId: assignment.levelId ?? undefined,
          sessionId: assignment.sessionId,
          semesterId: assignment.semesterId,
        },
      })),
    },
    include: {
      studentProfile: {
        include: {
          user: true,
          programme: true,
          level: true,
        },
      },
      session: true,
      semester: true,
      items: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });
}