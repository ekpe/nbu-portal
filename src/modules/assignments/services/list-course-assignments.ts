import { prisma } from "@/lib/db/prisma";

export async function listCourseAssignments() {
  return prisma.courseAssignment.findMany({
    include: {
      offering: {
        include: {
          course: true,
          session: true,
          semester: true,
        },
      },
      lecturer: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
