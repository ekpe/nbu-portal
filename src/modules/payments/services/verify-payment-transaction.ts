import { prisma } from "@/lib/db/prisma";
import { recomputeStudentFinanceFromPayments } from "./recompute-student-finance-from-payments";

export type VerifyPaymentTransactionInput = {
  paymentTransactionId: string;
  verifiedByUserId?: string | null;
  paymentStatus: "SUCCESS" | "FAILED" | "PENDING";
  verificationStatus: "VERIFIED" | "FAILED" | "UNVERIFIED";
  externalTransactionId?: string | null;
  verificationMessage?: string | null;
};

export async function verifyPaymentTransaction(
  input: VerifyPaymentTransactionInput,
) {
  const existing = await prisma.paymentTransaction.findUnique({
    where: { id: input.paymentTransactionId },
  });

  if (!existing) {
    throw new Error("Payment transaction not found.");
  }

  const updated = await prisma.paymentTransaction.update({
    where: { id: input.paymentTransactionId },
    data: {
      paymentStatus: input.paymentStatus,
      verificationStatus: input.verificationStatus,
      externalTransactionId: input.externalTransactionId ?? null,
      verificationMessage: input.verificationMessage ?? null,
      verificationCheckedAt: new Date(),
      verifiedByUserId: input.verifiedByUserId ?? null,
    },
  });

  await recomputeStudentFinanceFromPayments(existing.studentProfileId);

  return updated;
}