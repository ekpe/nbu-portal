/*
  Warnings:

  - You are about to drop the column `createdByUserId` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `paymentProvider` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `providerPayload` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `receiptNumber` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `reconciledAt` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `studentFeeProfileId` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionReference` on the `PaymentTransaction` table. All the data in the column will be lost.
  - The `verificationStatus` column on the `PaymentTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `paymentDate` on the `ReceiptLedgerEntry` table. All the data in the column will be lost.
  - You are about to drop the `FinancialOverride` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegistrationHold` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentFeeProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reference]` on the table `PaymentTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentFinanceAccountId` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentChannel` on table `PaymentTransaction` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `description` to the `ReceiptLedgerEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptDate` to the `ReceiptLedgerEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentFinanceAccountId` to the `ReceiptLedgerEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."FinancialOverride" DROP CONSTRAINT "FinancialOverride_studentFeeProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FinancialOverride" DROP CONSTRAINT "FinancialOverride_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_studentFeeProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" DROP CONSTRAINT "ReceiptLedgerEntry_paymentTransactionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" DROP CONSTRAINT "ReceiptLedgerEntry_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" DROP CONSTRAINT "ReceiptLedgerEntry_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RegistrationHold" DROP CONSTRAINT "RegistrationHold_studentFeeProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RegistrationHold" DROP CONSTRAINT "RegistrationHold_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentFeeProfile" DROP CONSTRAINT "StudentFeeProfile_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentFeeProfile" DROP CONSTRAINT "StudentFeeProfile_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentFeeProfile" DROP CONSTRAINT "StudentFeeProfile_studentProfileId_fkey";

-- DropIndex
DROP INDEX "public"."PaymentTransaction_receiptNumber_key";

-- DropIndex
DROP INDEX "public"."PaymentTransaction_studentFeeProfileId_idx";

-- DropIndex
DROP INDEX "public"."PaymentTransaction_transactionReference_key";

-- DropIndex
DROP INDEX "public"."ReceiptLedgerEntry_paymentTransactionId_key";

-- DropIndex
DROP INDEX "public"."ReceiptLedgerEntry_receiptNumber_idx";

-- AlterTable
ALTER TABLE "public"."PaymentTransaction" DROP COLUMN "createdByUserId",
DROP COLUMN "paymentProvider",
DROP COLUMN "providerPayload",
DROP COLUMN "receiptNumber",
DROP COLUMN "reconciledAt",
DROP COLUMN "studentFeeProfileId",
DROP COLUMN "transactionReference",
ADD COLUMN     "externalTransactionId" TEXT,
ADD COLUMN     "narration" TEXT,
ADD COLUMN     "paymentSource" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "studentFinanceAccountId" TEXT NOT NULL,
ALTER COLUMN "sessionId" DROP NOT NULL,
ALTER COLUMN "semesterId" DROP NOT NULL,
ALTER COLUMN "paymentChannel" SET NOT NULL,
DROP COLUMN "verificationStatus",
ADD COLUMN     "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "public"."ReceiptLedgerEntry" DROP COLUMN "paymentDate",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "receiptDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "studentFinanceAccountId" TEXT NOT NULL,
ALTER COLUMN "paymentTransactionId" DROP NOT NULL,
ALTER COLUMN "sessionId" DROP NOT NULL,
ALTER COLUMN "semesterId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."FinancialOverride";

-- DropTable
DROP TABLE "public"."RegistrationHold";

-- DropTable
DROP TABLE "public"."StudentFeeProfile";

-- DropEnum
DROP TYPE "public"."FinancialOverrideStatus";

-- DropEnum
DROP TYPE "public"."FinancialOverrideType";

-- DropEnum
DROP TYPE "public"."PaymentStatus";

-- DropEnum
DROP TYPE "public"."PaymentVerificationStatus";

-- DropEnum
DROP TYPE "public"."RegistrationHoldType";

-- CreateTable
CREATE TABLE "public"."StudentFinanceAccount" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "currentSessionId" TEXT,
    "currentSemesterId" TEXT,
    "tuitionAmountDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherChargesDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmountDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outstandingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isFinanciallyCleared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentFinanceAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FinanceHold" (
    "id" TEXT NOT NULL,
    "studentFinanceAccountId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "holdType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "placedByUserId" TEXT,
    "releasedByUserId" TEXT,
    "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceHold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FinanceOverrideRequest" (
    "id" TEXT NOT NULL,
    "studentFinanceAccountId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "approvedByUserId" TEXT,
    "requestType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceOverrideRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentFinanceAccount_studentProfileId_key" ON "public"."StudentFinanceAccount"("studentProfileId");

-- CreateIndex
CREATE INDEX "StudentFinanceAccount_currentSessionId_idx" ON "public"."StudentFinanceAccount"("currentSessionId");

-- CreateIndex
CREATE INDEX "StudentFinanceAccount_currentSemesterId_idx" ON "public"."StudentFinanceAccount"("currentSemesterId");

-- CreateIndex
CREATE INDEX "StudentFinanceAccount_isFinanciallyCleared_idx" ON "public"."StudentFinanceAccount"("isFinanciallyCleared");

-- CreateIndex
CREATE INDEX "FinanceHold_studentFinanceAccountId_idx" ON "public"."FinanceHold"("studentFinanceAccountId");

-- CreateIndex
CREATE INDEX "FinanceHold_studentProfileId_idx" ON "public"."FinanceHold"("studentProfileId");

-- CreateIndex
CREATE INDEX "FinanceHold_isActive_idx" ON "public"."FinanceHold"("isActive");

-- CreateIndex
CREATE INDEX "FinanceOverrideRequest_studentFinanceAccountId_idx" ON "public"."FinanceOverrideRequest"("studentFinanceAccountId");

-- CreateIndex
CREATE INDEX "FinanceOverrideRequest_studentProfileId_idx" ON "public"."FinanceOverrideRequest"("studentProfileId");

-- CreateIndex
CREATE INDEX "FinanceOverrideRequest_status_idx" ON "public"."FinanceOverrideRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_reference_key" ON "public"."PaymentTransaction"("reference");

-- CreateIndex
CREATE INDEX "PaymentTransaction_studentFinanceAccountId_idx" ON "public"."PaymentTransaction"("studentFinanceAccountId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_paymentStatus_idx" ON "public"."PaymentTransaction"("paymentStatus");

-- CreateIndex
CREATE INDEX "PaymentTransaction_verificationStatus_idx" ON "public"."PaymentTransaction"("verificationStatus");

-- CreateIndex
CREATE INDEX "ReceiptLedgerEntry_studentFinanceAccountId_idx" ON "public"."ReceiptLedgerEntry"("studentFinanceAccountId");

-- CreateIndex
CREATE INDEX "ReceiptLedgerEntry_paymentTransactionId_idx" ON "public"."ReceiptLedgerEntry"("paymentTransactionId");

-- CreateIndex
CREATE INDEX "ReceiptLedgerEntry_sessionId_idx" ON "public"."ReceiptLedgerEntry"("sessionId");

-- CreateIndex
CREATE INDEX "ReceiptLedgerEntry_semesterId_idx" ON "public"."ReceiptLedgerEntry"("semesterId");

-- AddForeignKey
ALTER TABLE "public"."StudentFinanceAccount" ADD CONSTRAINT "StudentFinanceAccount_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentFinanceAccount" ADD CONSTRAINT "StudentFinanceAccount_currentSessionId_fkey" FOREIGN KEY ("currentSessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentFinanceAccount" ADD CONSTRAINT "StudentFinanceAccount_currentSemesterId_fkey" FOREIGN KEY ("currentSemesterId") REFERENCES "public"."Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_studentFinanceAccountId_fkey" FOREIGN KEY ("studentFinanceAccountId") REFERENCES "public"."StudentFinanceAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" ADD CONSTRAINT "ReceiptLedgerEntry_studentFinanceAccountId_fkey" FOREIGN KEY ("studentFinanceAccountId") REFERENCES "public"."StudentFinanceAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" ADD CONSTRAINT "ReceiptLedgerEntry_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "public"."PaymentTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" ADD CONSTRAINT "ReceiptLedgerEntry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReceiptLedgerEntry" ADD CONSTRAINT "ReceiptLedgerEntry_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinanceHold" ADD CONSTRAINT "FinanceHold_studentFinanceAccountId_fkey" FOREIGN KEY ("studentFinanceAccountId") REFERENCES "public"."StudentFinanceAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinanceHold" ADD CONSTRAINT "FinanceHold_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinanceOverrideRequest" ADD CONSTRAINT "FinanceOverrideRequest_studentFinanceAccountId_fkey" FOREIGN KEY ("studentFinanceAccountId") REFERENCES "public"."StudentFinanceAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinanceOverrideRequest" ADD CONSTRAINT "FinanceOverrideRequest_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
