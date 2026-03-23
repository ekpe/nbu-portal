import { prisma } from "@/lib/db/prisma";

export async function getBursaryDashboardSummary() {
  const [
    totalStudentsWithAccounts,
    clearedCount,
    unclearedCount,
    pendingOverrides,
    activeHolds,
    verifiedPayments,
  ] = await Promise.all([
    prisma.studentFinanceAccount.count(),
    prisma.studentFinanceAccount.count({
      where: { isFinanciallyCleared: true },
    }),
    prisma.studentFinanceAccount.count({
      where: { isFinanciallyCleared: false },
    }),
    prisma.financeOverrideRequest.count({
      where: { status: "PENDING" },
    }),
    prisma.financeHold.count({
      where: { isActive: true },
    }),
    prisma.paymentTransaction.aggregate({
      _sum: { amount: true },
      where: {
        paymentStatus: "SUCCESS",
        verificationStatus: "VERIFIED",
      },
    }),
  ]);

  return {
    totalStudentsWithAccounts,
    clearedCount,
    unclearedCount,
    pendingOverrides,
    activeHolds,
    totalVerifiedPayments: verifiedPayments._sum.amount ?? 0,
  };
}