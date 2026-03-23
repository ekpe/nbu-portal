import { prisma } from "@/lib/db/prisma";
import { getOrCreateStudentFeeProfile } from "./get-or-create-student-fee-profile";
import { recomputeStudentFeeProfile } from "./recompute-student-fee-profile";
import { hasActiveFinancialOverride } from "@/modules/overrides/services/has-active-financial-override";
import { getActiveRegistrationHolds } from "@/modules/holds/services/get-active-registration-holds";

export type FinancialClearanceResult = {
  allowed: boolean;
  reason?: string;
  paymentStatus?: "UNPAID" | "PARTIAL" | "PAID";
  hasActiveHold: boolean;
  hasApprovedOverride: boolean;
  isFinanciallyCleared: boolean;
  outstandingBalance: number;
  feeProfileId?: string;
};

type Input = {
  studentProfileId: string;
  sessionId: string;
  semesterId: string;
};

export async function validateStudentFinancialClearance({
  studentProfileId,
  sessionId,
  semesterId,
}: Input): Promise<FinancialClearanceResult> {
  const feeProfile = await getOrCreateStudentFeeProfile({
    studentProfileId,
    sessionId,
    semesterId,
  });

  const refreshed = await recomputeStudentFeeProfile({
    studentProfileId,
    sessionId,
    semesterId,
  });

  const holds = await getActiveRegistrationHolds({
    studentFeeProfileId: feeProfile.id,
  });

  const hasActiveHold = holds.some((hold) => hold.holdType === "FINANCIAL");

  const hasApprovedOverride = await hasActiveFinancialOverride({
    studentFeeProfileId: feeProfile.id,
  });

  if (hasActiveHold && !hasApprovedOverride) {
    return {
      allowed: false,
      reason: "Registration blocked due to an active financial hold.",
      paymentStatus: refreshed.paymentStatus,
      hasActiveHold: true,
      hasApprovedOverride: false,
      isFinanciallyCleared: refreshed.isFinanciallyCleared,
      outstandingBalance: refreshed.outstandingBalance,
      feeProfileId: refreshed.id,
    };
  }

  if (refreshed.isFinanciallyCleared) {
    return {
      allowed: true,
      paymentStatus: refreshed.paymentStatus,
      hasActiveHold,
      hasApprovedOverride,
      isFinanciallyCleared: true,
      outstandingBalance: refreshed.outstandingBalance,
      feeProfileId: refreshed.id,
    };
  }

  if (hasApprovedOverride) {
    return {
      allowed: true,
      reason: "Financial override approved for registration.",
      paymentStatus: refreshed.paymentStatus,
      hasActiveHold,
      hasApprovedOverride: true,
      isFinanciallyCleared: refreshed.isFinanciallyCleared,
      outstandingBalance: refreshed.outstandingBalance,
      feeProfileId: refreshed.id,
    };
  }

  return {
    allowed: false,
    reason: "Registration blocked because student is not financially cleared.",
    paymentStatus: refreshed.paymentStatus,
    hasActiveHold,
    hasApprovedOverride: false,
    isFinanciallyCleared: refreshed.isFinanciallyCleared,
    outstandingBalance: refreshed.outstandingBalance,
    feeProfileId: refreshed.id,
  };
}