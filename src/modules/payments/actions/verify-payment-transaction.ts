"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { verifyPaymentTransaction } from "@/modules/payments/services/verify-payment-transaction";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function verifyPaymentTransactionAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const paymentTransactionId = String(
    formData.get("paymentTransactionId") ?? "",
  ).trim();

  if (!paymentTransactionId) {
    throw new Error("Payment transaction ID is required.");
  }

  const before = await prisma.paymentTransaction.findUnique({
    where: { id: paymentTransactionId },
  });

  if (!before) {
    throw new Error("Payment transaction not found.");
  }

  const updated = await verifyPaymentTransaction({
    paymentTransactionId,
    verifiedByUserId: session.user.id,
    paymentStatus: "SUCCESS",
    verificationStatus: "VERIFIED",
    externalTransactionId: before.externalTransactionId ?? `MANUAL-${before.reference}`,
    verificationMessage: "Manually verified by bursary/admin.",
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "PAYMENT_TRANSACTION_VERIFIED",
    entityType: "PAYMENT_TRANSACTION",
    entityId: updated.id,
    summary: `Verified payment transaction ${updated.reference}`,
    beforeJson: before,
    afterJson: updated,
  });
}