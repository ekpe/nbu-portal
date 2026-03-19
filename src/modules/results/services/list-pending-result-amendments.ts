import { prisma } from "@/lib/db/prisma";

export async function listPendingResultAmendments() {
  return prisma.resultAmendmentRequest.findMany({
    where: { status: "PENDING" },
    include: {
      resultSheet: {
        include: {
          offering: {
            include: {
              course: true,
              session: true,
              semester: true,
            },
          },
        },
      },
    },
    orderBy: {
      requestedAt: "asc",
    },
  });
}