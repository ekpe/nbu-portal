import { prisma } from "@/lib/db/prisma";
import { getOrCreateStudentFeeProfile } from "./get-or-create-student-fee-profile";

type Input = {
  studentProfileId: string;
  sessionId: string;
  semesterId: string;
  amount: number;
  paymentChannel?: string | null;
  paymentProvider?: string | null;
  transactionReference: string;
  receiptNumber?: string | null;
  paymentDate: Date;
  createdByUserId?: string | null;
  providerPayload?: unknown;
};

export async function createPaymentTransaction(input: Input) {
  const feeProfile = await getOrCreateStudentFeeProfile({
    studentProfileId: input.studentProfileId,
    sessionId: input.sessionId,
    semesterId: input.semesterId,
  });

  return prisma.paymentTransaction.create({
    data: {
      studentFeeProfileId: feeProfile.id,
      studentProfileId: input.studentProfileId,
      sessionId: input.sessionId,
      semesterId: input.semesterId,
      amount: input.amount,
      paymentChannel: input.paymentChannel ?? null,
      paymentProvider: input.paymentProvider ?? null,
      transactionReference: input.transactionReference,
      receiptNumber: input.receiptNumber ?? null,
      paymentDate: input.paymentDate,
      createdByUserId: input.createdByUserId ?? null,
      providerPayload: input.providerPayload as any,
      verificationStatus: "PENDING",
    },
  });
}