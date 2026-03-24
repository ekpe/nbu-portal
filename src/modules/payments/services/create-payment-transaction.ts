import { prisma } from "@/lib/db/prisma";
import { ensureStudentFinanceAccount } from "./ensure-student-finance-account";

export type CreatePaymentTransactionInput = {
  studentProfileId: string;
  reference: string;
  paymentChannel: string;
  paymentSource?: string | null;
  paymentDate: Date;
  amount: number;
  currency?: string;
  paymentStatus?: "PENDING" | "SUCCESS" | "FAILED";
  verificationStatus?: "UNVERIFIED" | "VERIFIED" | "FAILED";
  externalTransactionId?: string | null;
  sessionId?: string | null;
  semesterId?: string | null;
  narration?: string | null;
};

export async function createPaymentTransaction(
  input: CreatePaymentTransactionInput,
) {
  const financeAccount = await ensureStudentFinanceAccount({
    studentProfileId: input.studentProfileId,
    sessionId: input.sessionId ?? null,
    semesterId: input.semesterId ?? null,
  });

  return prisma.paymentTransaction.create({
    data: {
      studentFinanceAccountId: financeAccount.id,
      studentProfileId: input.studentProfileId,
      reference: input.reference,
      paymentChannel: input.paymentChannel,
      paymentSource: input.paymentSource ?? null,
      paymentDate: input.paymentDate,
      amount: input.amount,
      currency: input.currency ?? "NGN",
      paymentStatus: input.paymentStatus ?? "PENDING",
      verificationStatus: input.verificationStatus ?? "UNVERIFIED",
      externalTransactionId: input.externalTransactionId ?? null,
      sessionId: input.sessionId ?? null,
      semesterId: input.semesterId ?? null,
      narration: input.narration ?? null,
    },
  });
}