-- AlterTable
ALTER TABLE "public"."PaymentTransaction" ADD COLUMN     "verificationCheckedAt" TIMESTAMP(3),
ADD COLUMN     "verificationMessage" TEXT,
ADD COLUMN     "verifiedByUserId" TEXT;

-- CreateTable
CREATE TABLE "public"."InstallmentPlan" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "approvedByUserId" TEXT,
    "totalAmountDue" DOUBLE PRECISION NOT NULL,
    "minimumRequiredToRegister" DOUBLE PRECISION NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstallmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstallmentPlan_studentProfileId_idx" ON "public"."InstallmentPlan"("studentProfileId");

-- CreateIndex
CREATE INDEX "InstallmentPlan_sessionId_idx" ON "public"."InstallmentPlan"("sessionId");

-- CreateIndex
CREATE INDEX "InstallmentPlan_semesterId_idx" ON "public"."InstallmentPlan"("semesterId");

-- CreateIndex
CREATE INDEX "InstallmentPlan_isActive_idx" ON "public"."InstallmentPlan"("isActive");

-- AddForeignKey
ALTER TABLE "public"."InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
