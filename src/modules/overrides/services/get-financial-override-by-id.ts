import { prisma } from "@/lib/db/prisma";

export async function getFinancialOverrideById(id: string) {
  return prisma.financeOverrideRequest.findUnique({
    where: { id },
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
  });
}