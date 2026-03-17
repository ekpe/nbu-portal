import { prisma } from "@/lib/db/prisma";

export async function getResultSheetById(id: string) {
  return prisma.resultSheet.findUnique({
    where: { id },
    include: {
      offering: {
        include: {
          course: true,
          session: true,
          semester: true,
          faculty: true,
          department: true,
          programme: true,
          level: true,
        },
      },
      lecturer: {
        include: {
          user: true,
        },
      },
      entries: {
        include: {
          studentProfile: {
            include: {
              user: true,
            },
          },
          registration: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      approvals: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}