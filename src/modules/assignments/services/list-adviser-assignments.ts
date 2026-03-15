import { prisma } from "@/lib/db/prisma";

export async function listAdviserAssignments() {
  return prisma.adviserAssignment.findMany({
    include: {
      staffProfile: {
        include: {
          user: true,
        },
      },
      faculty: true,
      department: true,
      programme: true,
      level: true,
      session: true,
      semester: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
