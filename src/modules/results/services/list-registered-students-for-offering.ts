import { prisma } from "@/lib/db/prisma";

export async function listRegisteredStudentsForOffering(courseOfferingId: string) {
  const items = await prisma.courseRegistrationItem.findMany({
    where: {
      courseOfferingId,
      registration: {
        status: {
          in: ["SUBMITTED", "APPROVED"],
        },
      },
    },
    include: {
      registration: {
        include: {
          studentProfile: {
            include: {
              user: true,
            },
          },
        },
      },
      course: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return items.map((item) => ({
    registrationId: item.registrationId,
    studentProfile: item.registration.studentProfile,
    course: item.course,
  }));
}