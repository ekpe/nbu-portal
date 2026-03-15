import { prisma } from "@/lib/db/prisma";

export async function getStaffProfileByUserId(userId: string) {
  return prisma.staffProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      faculty: true,
      department: true,
    },
  });
}