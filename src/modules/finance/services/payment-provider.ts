export type PaymentVerificationResult = {
  success: boolean;
  paymentStatus: "SUCCESS" | "FAILED" | "PENDING";
  verificationStatus: "VERIFIED" | "FAILED" | "UNVERIFIED";
  externalTransactionId?: string | null;
  message?: string | null;
};

export interface PaymentProvider {
  verifyPayment(reference: string): Promise<PaymentVerificationResult>;
}