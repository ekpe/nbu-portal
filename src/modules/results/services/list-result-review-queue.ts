import { prisma } from "@/lib/db/prisma";

export async function listResultReviewQueue() {
  return prisma.resultSheet.findMany({
    where: {
      status: "LECTURER_SUBMITTED",
    },
    include: {
      offering: {
        include: {
          course: true,
          session: true,
          semester: true,
          department: true,
          programme: true,
        },
      },
      lecturer: {
        include: {
          user: true,
        },
      },
      entries: true,
    },
    orderBy: {
      submittedAt: "asc",
    },
  });
}