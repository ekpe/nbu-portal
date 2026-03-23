"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { paymentTransactionSchema } from "@/modules/finance/validators/payment-transaction-schema";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { recomputeStudentFinanceBalance } from "@/modules/finance/services/recompute-student-finance-balance";
import { createBulkNotifications } from "@/modules/notifications/services/create-bulk-notifications";

export async function createPaymentTransactionAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = paymentTransactionSchema.safeParse({
    studentProfileId: formData.get("studentProfileId"),
    reference: formData.get("reference"),
    paymentChannel: formData.get("paymentChannel"),
    paymentSource: formData.get("paymentSource"),
    paymentDate: formData.get("paymentDate"),
    amount: formData.get("amount"),
    currency: formData.get("currency") || "NGN",
    narration: formData.get("narration"),
    sessionId: formData.get("sessionId"),
    semesterId: formData.get("semesterId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid payment transaction.");
  }

  const financeAccount = await prisma.studentFinanceAccount.findUnique({
    where: { studentProfileId: parsed.data.studentProfileId },
  });

  if (!financeAccount) {
    throw new Error("Student finance account not found.");
  }

  const tx = await prisma.paymentTransaction.create({
    data: {
      studentFinanceAccountId: financeAccount.id,
      studentProfileId: parsed.data.studentProfileId,
      reference: parsed.data.reference,
      paymentChannel: parsed.data.paymentChannel,
      paymentSource: parsed.data.paymentSource || null,
      paymentDate: new Date(parsed.data.paymentDate),
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      narration: parsed.data.narration || null,
      sessionId: parsed.data.sessionId || null,
      semesterId: parsed.data.semesterId || null,
      paymentStatus: "SUCCESS",
      verificationStatus: "VERIFIED",
    },
  });

  await prisma.receiptLedgerEntry.create({
    data: {
      studentFinanceAccountId: financeAccount.id,
      studentProfileId: parsed.data.studentProfileId,
      paymentTransactionId: tx.id,
      receiptNumber: `RCT-${Date.now()}`,
      receiptDate: tx.paymentDate,
      amount: tx.amount,
      description: tx.narration || "Payment received",
      sessionId: tx.sessionId,
      semesterId: tx.semesterId,
    },
  });

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { id: parsed.data.studentProfileId },
  });

  if (studentProfile) {
    await createBulkNotifications({
      userIds: [studentProfile.userId],
      title: "Payment recorded",
      message: `Your payment with reference ${tx.reference} has been recorded.`,
    });
  }


  await recomputeStudentFinanceBalance(parsed.data.studentProfileId);

  await writeAuditLog({
    actorId: session.user.id,
    action: "PAYMENT_TRANSACTION_CREATED",
    entityType: "PAYMENT_TRANSACTION",
    entityId: tx.id,
    summary: `Recorded payment transaction ${tx.reference}`,
    afterJson: tx,
  });
}