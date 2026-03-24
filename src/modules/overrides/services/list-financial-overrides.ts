import { prisma } from "@/lib/db/prisma";

export async function listFinancialOverrides() {
  return prisma.financeOverrideRequest.findMany({
    include: {
      financeAccount: true,
      studentProfile: {
        include: {
          user: true,
          programme: true,
          level: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}