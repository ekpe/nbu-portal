import { prisma } from "@/lib/db/prisma";

export async function checkStudentInstallmentClearance(
  studentProfileId: string,
  sessionId?: string | null,
  semesterId?: string | null,
) {
  if (!sessionId || !semesterId) {
    return { allowed: false, errors: ["Session or semester not provided."] };
  }

  const [account, plan] = await Promise.all([
    prisma.studentFinanceAccount.findUnique({
      where: { studentProfileId },
    }),
    prisma.installmentPlan.findFirst({
      where: {
        studentProfileId,
        sessionId,
        semesterId,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!account) {
    return { allowed: false, errors: ["Student finance account not found."] };
  }

  if (!plan) {
    return { allowed: true, errors: [] as string[] };
  }

  if (account.totalAmountPaid < plan.minimumRequiredToRegister) {
    return {
      allowed: false,
      errors: [
        `Minimum required payment for installment registration is ${plan.minimumRequiredToRegister}.`,
      ],
    };
  }

  return { allowed: true, errors: [] as string[] };
}