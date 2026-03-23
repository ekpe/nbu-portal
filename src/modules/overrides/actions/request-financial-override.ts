"use server";

import { prisma } from "@/lib/db/prisma";
import { requestFinancialOverrideSchema } from "@/modules/overrides/validators/request-financial-override-schema";
import { getOrCreateStudentFeeProfile } from "@/modules/payments/services/get-or-create-student-fee-profile";
import { revalidatePath } from "next/cache";

type ActionState =
  | { success: true }
  | { success: false; message: string };

export async function requestFinancialOverrideAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const parsed = requestFinancialOverrideSchema.safeParse({
    studentProfileId: formData.get("studentProfileId"),
    sessionId: formData.get("sessionId"),
    semesterId: formData.get("semesterId"),
    reason: formData.get("reason"),
    effectiveFrom: formData.get("effectiveFrom") || null,
    expiresAt: formData.get("expiresAt") || null,
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid override request data." };
  }

  const data = parsed.data;

  const feeProfile = await getOrCreateStudentFeeProfile({
    studentProfileId: data.studentProfileId,
    sessionId: data.sessionId,
    semesterId: data.semesterId,
  });

  await prisma.financialOverride.create({
    data: {
      studentFeeProfileId: feeProfile.id,
      studentProfileId: data.studentProfileId,
      reason: data.reason,
      effectiveFrom: data.effectiveFrom ?? null,
      expiresAt: data.expiresAt ?? null,
      status: "PENDING",
      overrideType: "REGISTRATION_EXCEPTION",
    },
  });

  revalidatePath("/student/payments");
  revalidatePath("/admin/finance/overrides");

  return { success: true };
}