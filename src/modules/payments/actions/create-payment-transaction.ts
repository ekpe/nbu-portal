"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { createPaymentTransaction } from "@/modules/payments/services/create-payment-transaction";
import { createReceiptLedgerEntry } from "@/modules/payments/services/create-receipt-ledger-entry";
import { recomputeStudentFinanceFromPayments } from "@/modules/payments/services/recompute-student-finance-from-payments";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function createPaymentTransactionAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const studentProfileId = String(formData.get("studentProfileId") ?? "").trim();
  const reference = String(formData.get("reference") ?? "").trim();
  const paymentChannel = String(formData.get("paymentChannel") ?? "").trim();
  const paymentSource = String(formData.get("paymentSource") ?? "").trim();
  const paymentDateRaw = String(formData.get("paymentDate") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const currency = String(formData.get("currency") ?? "NGN").trim();
  const sessionId = String(formData.get("sessionId") ?? "").trim();
  const semesterId = String(formData.get("semesterId") ?? "").trim();
  const narration = String(formData.get("narration") ?? "").trim();

  if (!studentProfileId || !reference || !paymentChannel || !paymentDateRaw || !amountRaw) {
    throw new Error("Required payment fields are missing.");
  }

  const paymentDate = new Date(paymentDateRaw);
  const amount = Number(amountRaw);

  if (Number.isNaN(paymentDate.getTime())) {
    throw new Error("Invalid payment date.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const tx = await createPaymentTransaction({
    studentProfileId,
    reference,
    paymentChannel,
    paymentSource: paymentSource || null,
    paymentDate,
    amount,
    currency,
    paymentStatus: "SUCCESS",
    verificationStatus: "VERIFIED",
    sessionId: sessionId || null,
    semesterId: semesterId || null,
    narration: narration || null,
  });

  await createReceiptLedgerEntry({
    studentFinanceAccountId: tx.studentFinanceAccountId,
    studentProfileId: tx.studentProfileId,
    paymentTransactionId: tx.id,
    receiptNumber: `RCT-${Date.now()}`,
    receiptDate: tx.paymentDate,
    amount: tx.amount,
    description: tx.narration || "Payment received",
    sessionId: tx.sessionId,
    semesterId: tx.semesterId,
  });

  await recomputeStudentFinanceFromPayments(studentProfileId);

  await writeAuditLog({
    actorId: session.user.id,
    action: "PAYMENT_TRANSACTION_CREATED",
    entityType: "PAYMENT_TRANSACTION",
    entityId: tx.id,
    summary: `Recorded payment transaction ${tx.reference}`,
    afterJson: tx,
  });
}