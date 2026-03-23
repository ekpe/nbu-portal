-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID');

-- CreateEnum
CREATE TYPE "public"."PaymentVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "public"."RegistrationHoldType" AS ENUM ('FINANCIAL', 'ADMIN', 'ACADEMIC');

-- CreateEnum
CREATE TYPE "public"."FinancialOverrideType" AS ENUM ('REGISTRATION_EXCEPTION');

-- CreateEnum
CREATE TYPE "public"."FinancialOverrideStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."StudentFeeProfile" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "totalFeesDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outstandingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "isFinanciallyCleared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentFeeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentTransaction" (
    "id" TEXT NOT NULL,
    "studentFeeProfileId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "transactionReference" TEXT NOT NULL,
    "receiptNumber" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "paymentChannel" TEXT,
    "paymentProvider" TEXT,
    "providerPayload" JSONB,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "verificationStatus" "public"."PaymentVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reconciledAt" TIMESTAMP(3),
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RegistrationHold" (
    "id" TEXT NOT NULL,
    "studentFeeProfileId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "holdType" "public"."RegistrationHoldType" NOT NULL DEFAULT 'FINANCIAL',
    "reason" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "placedByUserId" TEXT,
    "releasedByUserId" TEXT,
    "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationHold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FinancialOverride" (
    "id" TEXT NOT NULL,
    "studentFeeProfileId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "approvedByUserId" TEXT,
    "overrideType" "public"."FinancialOverrideType" NOT NULL DEFAULT 'REGISTRATION_EXCEPTION',
    "reason" TEXT NOT NULL,
    "status" "public"."FinancialOverrideStatus" NOT NULL DEFAULT 'PENDING',
    "effectiveFrom" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReceiptLedgerEntry" (
    "id" TEXT NOT NULL,
    "paymentTransactionId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentFeeProfile_studentProfileId_idx" ON "public"."StudentFeeProfile"("studentProfileId");

-- CreateIndex
CREATE INDEX "StudentFeeProfile_sessionId_idx" ON "public"."StudentFeeProfile"("sessionId");

-- CreateIndex
CREATE INDEX "StudentFeeProfile_semesterId_idx" ON "public"."StudentFeeProfile"("semesterId");

-- CreateIndex
CREATE INDEX "StudentFeeProfile_paymentStatus_idx" ON "public"."StudentFeeProfile"("paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "StudentFeeProfile_studentProfileId_sessionId_semesterId_key" ON "public"."StudentFeeProfile"("studentProfileId", "sessionId", "semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_transactionReference_key" ON "public"."PaymentTransaction"("transactionReference");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_receiptNumber_key" ON "public"."PaymentTransaction"("receiptNumber");

-- CreateIndex
CREATE INDEX "PaymentTransaction_studentFeeProfileId_idx" ON "public"."PaymentTransaction"("studentFeeProfileId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_studentProfileId_idx" ON "public"."PaymentTransaction"("studentProfileId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_sessionId_idx" ON "public"."PaymentTransaction"("sessionId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_semesterId_idx" ON "public"."PaymentTransaction"("semesterId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_verificationStatus_idx" ON "public"."PaymentTransaction"("verificationStatus");

-- CreateIndex
CREATE INDEX "RegistrationHold_studentFeeProfileId_idx" ON "public"."RegistrationHold"("studentFeeProfileId");

-- CreateIndex
CREATE INDEX "RegistrationHold_studentProfileId_idx" ON "public"."RegistrationHold"("studentProfileId");

-- CreateIndex
CREATE INDEX "RegistrationHold_holdType_idx" ON "public"."RegistrationHold"("holdType");

-- CreateIndex
CREATE INDEX "RegistrationHold_isActive_idx" ON "public"."RegistrationHold"("isActive");

-- CreateIndex
CREATE INDEX "FinancialOverride_studentFeeProfileId_idx" ON "public"."FinancialOverride"("studentFeeProfileId");

-- CreateIndex
CREATE INDEX "FinancialOverride_studentProfileId_idx" ON "public"."FinancialOverride"("studentProfileId");

-- CreateIndex
CREATE INDEX "FinancialOverride_status_idx" ON "public"."FinancialOverride"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ReceiptLedgerEntry_paymentTransactionId_key" ON "public"."ReceiptLedgerEntry"("paymentTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReceiptLedgerEntry_receiptNumber_key" ON "public"."ReceiptLedgerEntry"("receiptNumber");

-- CreateIndex
CREATE INDEX "ReceiptLedgerEntry_studentProfileId_idx" ON "public"."ReceiptLedgerEntry"("studentProfileId");

-- CreateIndex
CREATE INDEX "ReceiptLedgerEntry_receiptNumber_idx" ON "public"."ReceiptLedgerEntry"("receiptNumber");

-- AddForeignKey
ALTER TABLE "public"."StudentFeeProfile" ADD CONSTRAINT "StudentFeeProfile_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentFeeProfile" ADD CONSTRAINT "StudentFeeProfile_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentFeeProfile" ADD CONSTRAINT "StudentFeeProfile_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_studentFeeProfileId_fkey" FOREIGN KEY ("studentFeeProfileId") REFERENCES "public"."StudentFeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RegistrationHold" ADD CONSTRAINT "RegistrationHold_studentFeeProfileId_fkey" FOREIGN KEY ("studentFeeProfileId") REFERENCES "public"."StudentFeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RegistrationHold" ADD CONSTRAINT "RegistrationHold_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinancialOverride" ADD CONSTRAINT "FinancialOverride_studentFeeProfileId_fkey" FOREIGN KEY ("studentFeeProfileId") REFERENCES "public"."StudentFeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinancialOverride" ADD CONSTRAINT "FinancialOverride_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" ADD CONSTRAINT "ReceiptLedgerEntry_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "public"."PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" ADD CONSTRAINT "ReceiptLedgerEntry_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" ADD CONSTRAINT "ReceiptLedgerEntry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" ADD CONSTRAINT "ReceiptLedgerEntry_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
