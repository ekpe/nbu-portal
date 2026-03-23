type FinanceAuditMetadataInput = {
  studentProfileId?: string | null;
  sessionId?: string | null;
  semesterId?: string | null;
  studentFeeProfileId?: string | null;
  paymentTransactionId?: string | null;
  holdId?: string | null;
  overrideId?: string | null;
  amount?: number | null;
  transactionReference?: string | null;
  reason?: string | null;
  status?: string | null;
};

export function buildFinanceAuditMetadata(input: FinanceAuditMetadataInput) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  );
}