-- CreateTable
CREATE TABLE "public"."StudentProgrammeEnrollment" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "enrollmentStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProgrammeEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseRegistration" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalCredits" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "createdByUserId" TEXT,
    "updatedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseRegistrationItem" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "courseOfferingId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "creditUnits" INTEGER NOT NULL,
    "itemType" TEXT NOT NULL DEFAULT 'NORMAL',
    "isCarryover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRegistrationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentProgrammeEnrollment_studentProfileId_idx" ON "public"."StudentProgrammeEnrollment"("studentProfileId");

-- CreateIndex
CREATE INDEX "StudentProgrammeEnrollment_programmeId_idx" ON "public"."StudentProgrammeEnrollment"("programmeId");

-- CreateIndex
CREATE INDEX "StudentProgrammeEnrollment_departmentId_idx" ON "public"."StudentProgrammeEnrollment"("departmentId");

-- CreateIndex
CREATE INDEX "StudentProgrammeEnrollment_facultyId_idx" ON "public"."StudentProgrammeEnrollment"("facultyId");

-- CreateIndex
CREATE INDEX "StudentProgrammeEnrollment_levelId_idx" ON "public"."StudentProgrammeEnrollment"("levelId");

-- CreateIndex
CREATE INDEX "StudentProgrammeEnrollment_sessionId_idx" ON "public"."StudentProgrammeEnrollment"("sessionId");

-- CreateIndex
CREATE INDEX "StudentProgrammeEnrollment_semesterId_idx" ON "public"."StudentProgrammeEnrollment"("semesterId");

-- CreateIndex
CREATE INDEX "CourseRegistration_studentProfileId_idx" ON "public"."CourseRegistration"("studentProfileId");

-- CreateIndex
CREATE INDEX "CourseRegistration_sessionId_idx" ON "public"."CourseRegistration"("sessionId");

-- CreateIndex
CREATE INDEX "CourseRegistration_semesterId_idx" ON "public"."CourseRegistration"("semesterId");

-- CreateIndex
CREATE INDEX "CourseRegistration_enrollmentId_idx" ON "public"."CourseRegistration"("enrollmentId");

-- CreateIndex
CREATE INDEX "CourseRegistration_status_idx" ON "public"."CourseRegistration"("status");

-- CreateIndex
CREATE INDEX "CourseRegistrationItem_registrationId_idx" ON "public"."CourseRegistrationItem"("registrationId");

-- CreateIndex
CREATE INDEX "CourseRegistrationItem_courseOfferingId_idx" ON "public"."CourseRegistrationItem"("courseOfferingId");

-- CreateIndex
CREATE INDEX "CourseRegistrationItem_courseId_idx" ON "public"."CourseRegistrationItem"("courseId");

-- AddForeignKey
ALTER TABLE "public"."StudentProgrammeEnrollment" ADD CONSTRAINT "StudentProgrammeEnrollment_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProgrammeEnrollment" ADD CONSTRAINT "StudentProgrammeEnrollment_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "public"."Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProgrammeEnrollment" ADD CONSTRAINT "StudentProgrammeEnrollment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProgrammeEnrollment" ADD CONSTRAINT "StudentProgrammeEnrollment_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "public"."Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProgrammeEnrollment" ADD CONSTRAINT "StudentProgrammeEnrollment_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "public"."Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProgrammeEnrollment" ADD CONSTRAINT "StudentProgrammeEnrollment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProgrammeEnrollment" ADD CONSTRAINT "StudentProgrammeEnrollment_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseRegistration" ADD CONSTRAINT "CourseRegistration_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "public"."StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseRegistration" ADD CONSTRAINT "CourseRegistration_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseRegistration" ADD CONSTRAINT "CourseRegistration_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseRegistration" ADD CONSTRAINT "CourseRegistration_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "public"."StudentProgrammeEnrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseRegistrationItem" ADD CONSTRAINT "CourseRegistrationItem_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."CourseRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseRegistrationItem" ADD CONSTRAINT "CourseRegistrationItem_courseOfferingId_fkey" FOREIGN KEY ("courseOfferingId") REFERENCES "public"."CourseOffering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseRegistrationItem" ADD CONSTRAINT "CourseRegistrationItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
