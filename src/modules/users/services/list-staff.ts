import { prisma } from "@/lib/db/prisma";

export async function listStaff() {
  return prisma.staffProfile.findMany({
    include: {
      user: true,
      faculty: true,
      department: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}