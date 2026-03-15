import { prisma } from "@/lib/db/prisma";

export async function listCourses() {
  return prisma.course.findMany({
    include: {
      faculty: true,
      department: true,
      programme: true,
      level: true,
    },
    orderBy: { createdAt: "desc" },
  });
}