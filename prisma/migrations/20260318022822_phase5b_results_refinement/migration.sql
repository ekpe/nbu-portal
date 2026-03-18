-- AlterTable
ALTER TABLE "public"."CGPARecord" ADD COLUMN     "academicStanding" TEXT,
ADD COLUMN     "cumulativeCarryoverCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."GPARecord" ADD COLUMN     "academicStanding" TEXT,
ADD COLUMN     "carryoverCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."ResultEntry" ADD COLUMN     "contributesToGPA" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPassed" BOOLEAN,
ADD COLUMN     "triggersCarryover" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."ResultSheet" ADD COLUMN     "courseCoordinatorName" TEXT,
ADD COLUMN     "courseLecturerName" TEXT,
ADD COLUMN     "deanOfFacultyName" TEXT,
ADD COLUMN     "facultyExaminationOfficerName" TEXT,
ADD COLUMN     "headOfDepartmentName" TEXT;

-- CreateTable
CREATE TABLE "public"."ResultAmendmentRequest" (
    "id" TEXT NOT NULL,
    "resultSheetId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "approvedByUserId" TEXT,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultAmendmentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResultAmendmentRequest_resultSheetId_idx" ON "public"."ResultAmendmentRequest"("resultSheetId");

-- CreateIndex
CREATE INDEX "ResultAmendmentRequest_requestedByUserId_idx" ON "public"."ResultAmendmentRequest"("requestedByUserId");

-- CreateIndex
CREATE INDEX "ResultAmendmentRequest_approvedByUserId_idx" ON "public"."ResultAmendmentRequest"("approvedByUserId");

-- CreateIndex
CREATE INDEX "ResultAmendmentRequest_status_idx" ON "public"."ResultAmendmentRequest"("status");

-- AddForeignKey
ALTER TABLE "public"."ResultAmendmentRequest" ADD CONSTRAINT "ResultAmendmentRequest_resultSheetId_fkey" FOREIGN KEY ("resultSheetId") REFERENCES "public"."ResultSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
