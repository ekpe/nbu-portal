import { prisma } from "@/lib/db/prisma";

export async function checkStudentRegistrationFinanceClearance(studentProfileId: string) {
  const account = await prisma.studentFinanceAccount.findUnique({
    where: { studentProfileId },
    include: {
      financeHolds: {
        where: { isActive: true },
      },
    },
  });

  if (!account) {
    return {
      cleared: false,
      errors: ["Finance account not found."],
    };
  }

  const errors: string[] = [];

  if (account.outstandingBalance > 0) {
    errors.push("Outstanding balance must be cleared before registration.");
  }

  if (account.financeHolds.length > 0) {
    errors.push("A finance hold exists on this student account.");
  }

  if (!account.isFinanciallyCleared) {
    errors.push("Student is not financially cleared.");
  }

  return {
    cleared: errors.length === 0,
    errors,
  };
}