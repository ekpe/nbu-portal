import { prisma } from "@/lib/db/prisma";

export async function getRegistrationById(id: string) {
  return prisma.courseRegistration.findUnique({
    where: { id },
    include: {
      studentProfile: {
        include: {
          user: true,
          faculty: true,
          department: true,
          programme: true,
          level: true,
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
    },
  });
}