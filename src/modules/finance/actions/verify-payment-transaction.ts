"use server";

import { auth } from "@/auth";
import { paymentVerificationSchema } from "@/modules/finance/validators/payment-verification-schema";
import { verifyPaymentTransaction } from "@/modules/finance/services/verify-payment-transaction";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { prisma } from "@/lib/db/prisma";

export async function verifyPaymentTransactionAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = paymentVerificationSchema.safeParse({
    paymentTransactionId: formData.get("paymentTransactionId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid payment verification request.");
  }

  const before = await prisma.paymentTransaction.findUnique({
    where: { id: parsed.data.paymentTransactionId },
  });

  const updated = await verifyPaymentTransaction(
    parsed.data.paymentTransactionId,
    session.user.id,
  );

  await writeAuditLog({
    actorId: session.user.id,
    action: "PAYMENT_TRANSACTION_VERIFIED",
    entityType: "PAYMENT_TRANSACTION",
    entityId: updated.id,
    summary: `Verified transaction ${updated.reference}`,
    beforeJson: before,
    afterJson: updated,
  });
}