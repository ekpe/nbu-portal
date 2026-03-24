import { prisma } from "@/lib/db/prisma";

export async function listPaymentTransactions() {
  return prisma.paymentTransaction.findMany({
    include: {
      financeAccount: true,
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
    orderBy: {
      paymentDate: "desc",
    },
  });
}