import { prisma } from "@/lib/db/prisma";

export async function getStudentFinanceAccount(studentProfileId: string) {
  return prisma.studentFinanceAccount.findUnique({
    where: { studentProfileId },
    include: {
      currentSession: true,
      currentSemester: true,
      financeHolds: {
        where: { isActive: true },
        orderBy: { placedAt: "desc" },
      },
      paymentTransactions: {
        orderBy: { paymentDate: "desc" },
      },
      receiptLedgerEntries: {
        orderBy: { receiptDate: "desc" },
      },
    },
  });
}