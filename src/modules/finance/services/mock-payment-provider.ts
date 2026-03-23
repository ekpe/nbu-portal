import { PaymentProvider, PaymentVerificationResult } from "./payment-provider";

class MockPaymentProvider implements PaymentProvider {
  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    if (!reference) {
      return {
        success: false,
        paymentStatus: "FAILED",
        verificationStatus: "FAILED",
        message: "Missing payment reference.",
      };
    }

    return {
      success: true,
      paymentStatus: "SUCCESS",
      verificationStatus: "VERIFIED",
      externalTransactionId: `MOCK-${reference}`,
      message: "Mock verification successful.",
    };
  }
}

export const mockPaymentProvider = new MockPaymentProvider();