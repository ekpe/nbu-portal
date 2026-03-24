import {
  PaymentProvider,
  PaymentVerificationResult,
} from "./payment-provider";

class MockPaymentProvider implements PaymentProvider {
  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    // Normalize input
    const ref = (reference ?? "").trim();

    if (!ref) {
      return {
        success: false,
        paymentStatus: "FAILED",
        verificationStatus: "FAILED",
        externalTransactionId: null,
        message: "Missing payment reference.",
      };
    }

    // Optional: simulate failure scenarios (very useful for testing)
    if (ref.startsWith("FAIL")) {
      return {
        success: false,
        paymentStatus: "FAILED",
        verificationStatus: "FAILED",
        externalTransactionId: null,
        message: "Mock payment failed.",
      };
    }

    if (ref.startsWith("PENDING")) {
      return {
        success: true,
        paymentStatus: "PENDING",
        verificationStatus: "UNVERIFIED",
        externalTransactionId: `MOCK-${ref}`,
        message: "Mock payment pending.",
      };
    }

    // Default success case
    return {
      success: true,
      paymentStatus: "SUCCESS",
      verificationStatus: "VERIFIED",
      externalTransactionId: `MOCK-${ref}`,
      message: "Mock verification successful.",
    };
  }
}

export const mockPaymentProvider = new MockPaymentProvider();