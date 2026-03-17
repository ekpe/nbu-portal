import { prisma } from "@/lib/db/prisma";

export async function getOrCreateResultSheet(courseOfferingId: string, lecturerStaffProfileId: string) {
  const offering = await prisma.courseOffering.findUnique({
    where: { id: courseOfferingId },
    include: {
      assignments: true,
    },
  });

  if (!offering) {
    throw new Error("Course offering not found.");
  }

  let sheet = await prisma.resultSheet.findFirst({
    where: {
      courseOfferingId,
      lecturerStaffProfileId,
    },
    include: {
      entries: {
        include: {
          studentProfile: {
            include: {
              user: true,
            },
          },
        },
      },
      offering: {
        include: {
          course: true,
          session: true,
          semester: true,
        },
      },
    },
  });

  if (!sheet) {
    sheet = await prisma.resultSheet.create({
      data: {
        courseOfferingId,
        sessionId: offering.sessionId,
        semesterId: offering.semesterId,
        lecturerStaffProfileId,
        status: "DRAFT",
      },
      include: {
        entries: {
          include: {
            studentProfile: {
              include: { user: true },
            },
          },
        },
        offering: {
          include: {
            course: true,
            session: true,
            semester: true,
          },
        },
      },
    });
  }

  return sheet;
}