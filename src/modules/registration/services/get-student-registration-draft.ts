import { prisma } from "@/lib/db/prisma";

export async function getStudentRegistrationDraft(studentProfileId: string, sessionId: string, semesterId: string) {
  return prisma.courseRegistration.findFirst({
    where: {
      studentProfileId,
      sessionId,
      semesterId,
      status: "DRAFT",
    },
    include: {
      items: {
        include: {
          course: true,
          courseOffering: {
            include: {
              course: true,
            },
          },
        },
      },
      session: true,
      semester: true,
      enrollment: {
        include: {
          faculty: true,
          department: true,
          programme: true,
          level: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}