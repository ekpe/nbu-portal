import { prisma } from "@/lib/db/prisma";

export async function recomputeStudentFinanceBalance(studentProfileId: string) {
  const account = await prisma.studentFinanceAccount.findUnique({
    where: { studentProfileId },
    include: {
      paymentTransactions: {
        where: {
          paymentStatus: "SUCCESS",
          verificationStatus: "VERIFIED",
        },
      },
      financeHolds: {
        where: { isActive: true },
      },
    },
  });

  if (!account) {
    throw new Error("Finance account not found.");
  }

  const totalAmountPaid = account.paymentTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0,
  );

  const totalAmountDue = account.tuitionAmountDue + account.otherChargesDue;
  const outstandingBalance = totalAmountDue - totalAmountPaid;

  const isFinanciallyCleared =
    outstandingBalance <= 0 && account.financeHolds.length === 0;

  return prisma.studentFinanceAccount.update({
    where: { studentProfileId },
    data: {
      totalAmountDue,
      totalAmountPaid,
      outstandingBalance,
      isFinanciallyCleared,
    },
  });
}