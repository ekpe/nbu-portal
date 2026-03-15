import { prisma } from "@/lib/db/prisma";

export async function listStudents() {
  return prisma.studentProfile.findMany({
    include: {
      user: true,
      faculty: true,
      department: true,
      programme: true,
      level: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}