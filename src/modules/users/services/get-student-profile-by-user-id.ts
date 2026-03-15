import { prisma } from "@/lib/db/prisma";

export async function getStudentProfileByUserId(userId: string) {
  return prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      faculty: true,
      department: true,
      programme: true,
      level: true,
    },
  });
}