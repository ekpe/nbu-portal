import { prisma } from "@/lib/db/prisma";

export async function getStudentRegistrationHistory(studentProfileId: string) {
  return prisma.courseRegistration.findMany({
    where: { studentProfileId },
    include: {
      session: true,
      semester: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
}