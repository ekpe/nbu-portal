import { prisma } from "@/lib/db/prisma";

export async function listStudentPaymentTransactions(studentProfileId: string) {
  return prisma.paymentTransaction.findMany({
    where: {
      studentProfileId,
    },
    include: {
      session: true,
      semester: true,
      receiptLedgerEntries: true,
    },
    orderBy: {
      paymentDate: "desc",
    },
  });
}