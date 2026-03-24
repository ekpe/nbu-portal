import { prisma } from "@/lib/db/prisma";

type Input = {
  studentProfileId: string;
  sessionId?: string | null;
  semesterId?: string | null;
};

export async function ensureStudentFinanceAccount({
  studentProfileId,
  sessionId,
  semesterId,
}: Input) {
  const existing = await prisma.studentFinanceAccount.findUnique({
    where: { studentProfileId },
  });

  if (existing) {
    return prisma.studentFinanceAccount.update({
      where: { studentProfileId },
      data: {
        currentSessionId: sessionId ?? existing.currentSessionId,
        currentSemesterId: semesterId ?? existing.currentSemesterId,
      },
    });
  }

  return prisma.studentFinanceAccount.create({
    data: {
      studentProfileId,
      currentSessionId: sessionId ?? null,
      currentSemesterId: semesterId ?? null,
      tuitionAmountDue: 0,
      otherChargesDue: 0,
      totalAmountDue: 0,
      totalAmountPaid: 0,
      outstandingBalance: 0,
      isFinanciallyCleared: false,
    },
  });
}