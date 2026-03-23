import { prisma } from "@/lib/db/prisma";

type Input = {
  studentProfileId: string;
  sessionId: string;
  semesterId: string;
};

export async function getOrCreateStudentFeeProfile({
  studentProfileId,
  sessionId,
  semesterId,
}: Input) {
  const existing = await prisma.studentFeeProfile.findUnique({
    where: {
      studentProfileId_sessionId_semesterId: {
        studentProfileId,
        sessionId,
        semesterId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.studentFeeProfile.create({
    data: {
      studentProfileId,
      sessionId,
      semesterId,
      totalFeesDue: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      paymentStatus: "UNPAID",
      isFinanciallyCleared: false,
    },
  });
}