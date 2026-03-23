import { prisma } from "@/lib/db/prisma";
import { getOrCreateStudentFeeProfile } from "./get-or-create-student-fee-profile";

type Input = {
  studentProfileId: string;
  sessionId: string;
  semesterId: string;
};

export async function recomputeStudentFeeProfile({
  studentProfileId,
  sessionId,
  semesterId,
}: Input) {
  const feeProfile = await getOrCreateStudentFeeProfile({
    studentProfileId,
    sessionId,
    semesterId,
  });

  const verifiedPayments = await prisma.paymentTransaction.findMany({
    where: {
      studentProfileId,
      sessionId,
      semesterId,
      verificationStatus: "VERIFIED",
    },
    select: {
      amount: true,
    },
  });

  const totalPaid = verifiedPayments.reduce((sum, item) => sum + item.amount, 0);
  const totalFeesDue = feeProfile.totalFeesDue;
  const outstandingBalance = Math.max(totalFeesDue - totalPaid, 0);

  let paymentStatus: "UNPAID" | "PARTIAL" | "PAID" = "UNPAID";

  if (totalPaid <= 0) {
    paymentStatus = "UNPAID";
  } else if (totalPaid < totalFeesDue) {
    paymentStatus = "PARTIAL";
  } else {
    paymentStatus = "PAID";
  }

  const isFinanciallyCleared = totalFeesDue > 0
    ? totalPaid >= totalFeesDue
    : false;

  return prisma.studentFeeProfile.update({
    where: { id: feeProfile.id },
    data: {
      totalPaid,
      outstandingBalance,
      paymentStatus,
      isFinanciallyCleared,
    },
  });
}