-- AlterTable
ALTER TABLE "public"."CourseRegistration" ADD COLUMN     "deanApprovedAt" TIMESTAMP(3),
ADD COLUMN     "hodApprovedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."RegistrationApprovalAction" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actionType" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistrationApprovalAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TranscriptLedgerEntry" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "resultEntryId" TEXT,
    "courseCode" TEXT NOT NULL,
    "courseTitle" TEXT NOT NULL,
    "creditUnits" INTEGER NOT NULL,
    "totalScore" DOUBLE PRECISION,
    "letterGrade" TEXT,
    "gradePoint" DOUBLE PRECISION,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TranscriptLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistrationApprovalAction_registrationId_idx" ON "public"."RegistrationApprovalAction"("registrationId");

-- CreateIndex
CREATE INDEX "RegistrationApprovalAction_actorUserId_idx" ON "public"."RegistrationApprovalAction"("actorUserId");

-- CreateIndex
CREATE INDEX "TranscriptLedgerEntry_studentProfileId_idx" ON "public"."TranscriptLedgerEntry"("studentProfileId");

-- CreateIndex
CREATE INDEX "TranscriptLedgerEntry_sessionId_idx" ON "public"."TranscriptLedgerEntry"("sessionId");

-- CreateIndex
CREATE INDEX "TranscriptLedgerEntry_semesterId_idx" ON "public"."TranscriptLedgerEntry"("semesterId");

-- CreateIndex
CREATE INDEX "TranscriptLedgerEntry_courseId_idx" ON "public"."TranscriptLedgerEntry"("courseId");

-- CreateIndex
CREATE INDEX "TranscriptLedgerEntry_resultEntryId_idx" ON "public"."TranscriptLedgerEntry"("resultEntryId");

-- AddForeignKey
ALTER TABLE "public"."RegistrationApprovalAction" ADD CONSTRAINT "RegistrationApprovalAction_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."CourseRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscriptLedgerEntry" ADD CONSTRAINT "TranscriptLedgerEntry_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscriptLedgerEntry" ADD CONSTRAINT "TranscriptLedgerEntry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscriptLedgerEntry" ADD CONSTRAINT "TranscriptLedgerEntry_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscriptLedgerEntry" ADD CONSTRAINT "TranscriptLedgerEntry_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscriptLedgerEntry" ADD CONSTRAINT "TranscriptLedgerEntry_resultEntryId_fkey" FOREIGN KEY ("resultEntryId") REFERENCES "public"."ResultEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
