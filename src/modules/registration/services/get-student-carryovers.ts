import { prisma } from "@/lib/db/prisma";

export async function getStudentCarryovers(studentProfileId: string) {
  return prisma.resultEntry.findMany({
    where: {
      studentProfileId,
      triggersCarryover: true,
      resultSheet: {
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
    orderBy: {
      createdAt: "desc",
    },
  });
}