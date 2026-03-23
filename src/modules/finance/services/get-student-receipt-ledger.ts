import { prisma } from "@/lib/db/prisma";

export async function getStudentReceiptLedger(studentProfileId: string) {
  return prisma.receiptLedgerEntry.findMany({
    where: { studentProfileId },
    include: {
      session: true,
      semester: true,
      paymentTransaction: true,
    },
    orderBy: { receiptDate: "desc" },
  });
}