"use server";

import { prisma } from "@/lib/db/prisma";
import { reviewFinancialOverrideSchema } from "@/modules/overrides/validators/review-financial-override-schema";
import { revalidatePath } from "next/cache";

type ActionState =
  | { success: true }
  | { success: false; message: string };

export async function approveFinancialOverrideAction(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const parsed = reviewFinancialOverrideSchema.safeParse({
    overrideId: formData.get("overrideId"),
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid override approval request." };
  }

  const override = await prisma.financialOverride.findUnique({
    where: { id: parsed.data.overrideId },
  });

  if (!override) {
    return { success: false, message: "Override request not found." };
  }

  if (override.status !== "PENDING") {
    return { success: false, message: "Only pending requests can be approved." };
  }

  await prisma.financialOverride.update({
    where: { id: override.id },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
    },
  });

  revalidatePath("/admin/finance/overrides");
  revalidatePath("/student/payments");

  return { success: true };
}