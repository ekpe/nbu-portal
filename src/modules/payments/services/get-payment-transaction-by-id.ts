import { prisma } from "@/lib/db/prisma";

export async function getPaymentTransactionById(id: string) {
  return prisma.paymentTransaction.findUnique({
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
      session: true,
      semester: true,
      receiptLedgerEntries: true,
    },
  });
}