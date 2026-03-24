import { prisma } from "@/lib/db/prisma";

type Input = {
  studentFinanceAccountId: string;
  studentProfileId: string;
  paymentTransactionId?: string | null;
  receiptNumber: string;
  receiptDate: Date;
  amount: number;
  description: string;
  sessionId?: string | null;
  semesterId?: string | null;
};

export async function createReceiptLedgerEntry(input: Input) {
  return prisma.receiptLedgerEntry.create({
    data: {
      studentFinanceAccountId: input.studentFinanceAccountId,
      studentProfileId: input.studentProfileId,
      paymentTransactionId: input.paymentTransactionId ?? null,
      receiptNumber: input.receiptNumber,
      receiptDate: input.receiptDate,
      amount: input.amount,
      description: input.description,
      sessionId: input.sessionId ?? null,
      semesterId: input.semesterId ?? null,
    },
  });
}