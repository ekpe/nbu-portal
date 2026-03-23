import { prisma } from "@/lib/db/prisma";
import { mockPaymentProvider } from "./mock-payment-provider";
import { recomputeStudentFinanceBalance } from "./recompute-student-finance-balance";

export async function verifyPaymentTransaction(
  paymentTransactionId: string,
  verifiedByUserId?: string,
) {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { id: paymentTransactionId },
  });

  if (!transaction) {
    throw new Error("Payment transaction not found.");
  }

  const result = await mockPaymentProvider.verifyPayment(transaction.reference);

  const updated = await prisma.paymentTransaction.update({
    where: { id: paymentTransactionId },
    data: {
      paymentStatus: result.paymentStatus,
      verificationStatus: result.verificationStatus,
      externalTransactionId: result.externalTransactionId ?? null,
      verificationMessage: result.message ?? null,
      verificationCheckedAt: new Date(),
      verifiedByUserId: verifiedByUserId ?? null,
    },
  });

  await recomputeStudentFinanceBalance(transaction.studentProfileId);

  return updated;
}