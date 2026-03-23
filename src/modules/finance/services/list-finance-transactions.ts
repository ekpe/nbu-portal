import { prisma } from "@/lib/db/prisma";

export async function listFinanceTransactions() {
  return prisma.paymentTransaction.findMany({
    include: {
      studentProfile: {
        include: {
          user: true,
          programme: true,
          level: true,
        },
      },
      session: true,
      semester: true,
    },
    orderBy: { paymentDate: "desc" },
  });
}