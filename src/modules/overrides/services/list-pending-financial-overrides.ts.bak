import { prisma } from "@/lib/db/prisma";

export async function listPendingFinancialOverrides() {
  return prisma.financialOverride.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      studentProfile: true,
      studentFeeProfile: {
        include: {
          session: true,
          semester: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}