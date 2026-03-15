import { prisma } from "@/lib/db/prisma";

export async function listCourseOfferings() {
  return prisma.courseOffering.findMany({
    include: {
      course: true,
      session: true,
      semester: true,
      faculty: true,
      department: true,
      programme: true,
      level: true,
      assignments: {
        include: {
          lecturer: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}