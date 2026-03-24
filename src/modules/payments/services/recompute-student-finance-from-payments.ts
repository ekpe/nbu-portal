import { prisma } from "@/lib/db/prisma";

export async function recomputeStudentFinanceFromPayments(
  studentProfileId: string,
) {
  const studentFinanceAccount = await prisma.studentFinanceAccount.findUnique({
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

  if (!studentFinanceAccount) {
    throw new Error("Student finance account not found.");
  }

  const totalAmountPaid = studentFinanceAccount.paymentTransactions.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const totalAmountDue =
    studentFinanceAccount.tuitionAmountDue +
    studentFinanceAccount.otherChargesDue;

  const outstandingBalance = Math.max(totalAmountDue - totalAmountPaid, 0);

  const isFinanciallyCleared =
    outstandingBalance <= 0 &&
    studentFinanceAccount.financeHolds.length === 0;

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