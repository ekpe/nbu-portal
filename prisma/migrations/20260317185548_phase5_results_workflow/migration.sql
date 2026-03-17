-- CreateTable
CREATE TABLE "public"."ResultSheet" (
    "id" TEXT NOT NULL,
    "courseOfferingId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "lecturerStaffProfileId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "numberOfStudents" INTEGER NOT NULL DEFAULT 0,
    "numberRegisteredStudents" INTEGER,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResultEntry" (
    "id" TEXT NOT NULL,
    "resultSheetId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "registrationId" TEXT,
    "caScore" DOUBLE PRECISION,
    "examScore" DOUBLE PRECISION,
    "totalScore" DOUBLE PRECISION,
    "letterGrade" TEXT,
    "gradePoint" DOUBLE PRECISION,
    "remark" TEXT,
    "q1Score" DOUBLE PRECISION,
    "q2Score" DOUBLE PRECISION,
    "q3Score" DOUBLE PRECISION,
    "q4Score" DOUBLE PRECISION,
    "q5Score" DOUBLE PRECISION,
    "q6Score" DOUBLE PRECISION,
    "q7Score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResultApprovalAction" (
    "id" TEXT NOT NULL,
    "resultSheetId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actionType" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultApprovalAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GPARecord" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "totalUnitsAttempted" INTEGER NOT NULL,
    "totalUnitsPassed" INTEGER NOT NULL,
    "totalGradePoints" DOUBLE PRECISION NOT NULL,
    "gpa" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resultSheetId" TEXT,

    CONSTRAINT "GPARecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CGPARecord" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "totalCumulativeUnits" INTEGER NOT NULL,
    "totalCumulativeGradePoints" DOUBLE PRECISION NOT NULL,
    "cgpa" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CGPARecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResultSheet_courseOfferingId_idx" ON "public"."ResultSheet"("courseOfferingId");

-- CreateIndex
CREATE INDEX "ResultSheet_sessionId_idx" ON "public"."ResultSheet"("sessionId");

-- CreateIndex
CREATE INDEX "ResultSheet_semesterId_idx" ON "public"."ResultSheet"("semesterId");

-- CreateIndex
CREATE INDEX "ResultSheet_lecturerStaffProfileId_idx" ON "public"."ResultSheet"("lecturerStaffProfileId");

-- CreateIndex
CREATE INDEX "ResultSheet_status_idx" ON "public"."ResultSheet"("status");

-- CreateIndex
CREATE INDEX "ResultEntry_resultSheetId_idx" ON "public"."ResultEntry"("resultSheetId");

-- CreateIndex
CREATE INDEX "ResultEntry_studentProfileId_idx" ON "public"."ResultEntry"("studentProfileId");

-- CreateIndex
CREATE INDEX "ResultEntry_registrationId_idx" ON "public"."ResultEntry"("registrationId");

-- CreateIndex
CREATE INDEX "ResultApprovalAction_resultSheetId_idx" ON "public"."ResultApprovalAction"("resultSheetId");

-- CreateIndex
CREATE INDEX "ResultApprovalAction_actorUserId_idx" ON "public"."ResultApprovalAction"("actorUserId");

-- CreateIndex
CREATE INDEX "GPARecord_studentProfileId_idx" ON "public"."GPARecord"("studentProfileId");

-- CreateIndex
CREATE INDEX "GPARecord_sessionId_idx" ON "public"."GPARecord"("sessionId");

-- CreateIndex
CREATE INDEX "GPARecord_semesterId_idx" ON "public"."GPARecord"("semesterId");

-- CreateIndex
CREATE INDEX "CGPARecord_studentProfileId_idx" ON "public"."CGPARecord"("studentProfileId");

-- CreateIndex
CREATE INDEX "CGPARecord_sessionId_idx" ON "public"."CGPARecord"("sessionId");

-- CreateIndex
CREATE INDEX "CGPARecord_semesterId_idx" ON "public"."CGPARecord"("semesterId");

-- AddForeignKey
ALTER TABLE "public"."ResultSheet" ADD CONSTRAINT "ResultSheet_courseOfferingId_fkey" FOREIGN KEY ("courseOfferingId") REFERENCES "public"."CourseOffering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultSheet" ADD CONSTRAINT "ResultSheet_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultSheet" ADD CONSTRAINT "ResultSheet_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultSheet" ADD CONSTRAINT "ResultSheet_lecturerStaffProfileId_fkey" FOREIGN KEY ("lecturerStaffProfileId") REFERENCES "public"."StaffProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultEntry" ADD CONSTRAINT "ResultEntry_resultSheetId_fkey" FOREIGN KEY ("resultSheetId") REFERENCES "public"."ResultSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultEntry" ADD CONSTRAINT "ResultEntry_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultEntry" ADD CONSTRAINT "ResultEntry_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."CourseRegistration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResultApprovalAction" ADD CONSTRAINT "ResultApprovalAction_resultSheetId_fkey" FOREIGN KEY ("resultSheetId") REFERENCES "public"."ResultSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GPARecord" ADD CONSTRAINT "GPARecord_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GPARecord" ADD CONSTRAINT "GPARecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GPARecord" ADD CONSTRAINT "GPARecord_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GPARecord" ADD CONSTRAINT "GPARecord_resultSheetId_fkey" FOREIGN KEY ("resultSheetId") REFERENCES "public"."ResultSheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CGPARecord" ADD CONSTRAINT "CGPARecord_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CGPARecord" ADD CONSTRAINT "CGPARecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CGPARecord" ADD CONSTRAINT "CGPARecord_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
