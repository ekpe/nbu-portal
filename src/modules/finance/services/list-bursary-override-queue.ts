import { prisma } from "@/lib/db/prisma";

export async function listBursaryOverrideQueue() {
  return prisma.financeOverrideRequest.findMany({
    where: { status: "PENDING" },
    include: {
      studentProfile: {
        include: {
          user: true,
          programme: true,
          level: true,
        },
      },
      financeAccount: true,
    },
    orderBy: { createdAt: "asc" },
  });
}