-- CreateTable
CREATE TABLE "public"."Course" (
    "id" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "creditUnits" INTEGER NOT NULL,
    "departmentId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "programmeId" TEXT,
    "levelId" TEXT,
    "category" TEXT NOT NULL DEFAULT 'CORE',
    "isCarryoverEligible" BOOLEAN NOT NULL DEFAULT true,
    "isElective" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseOffering" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "programmeId" TEXT,
    "levelId" TEXT,
    "registrationCap" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseAssignment" (
    "id" TEXT NOT NULL,
    "courseOfferingId" TEXT NOT NULL,
    "lecturerStaffProfileId" TEXT NOT NULL,
    "assignedByUserId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdviserAssignment" (
    "id" TEXT NOT NULL,
    "staffProfileId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "departmentId" TEXT,
    "programmeId" TEXT,
    "levelId" TEXT,
    "sessionId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedByUserId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdviserAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseCode_key" ON "public"."Course"("courseCode");

-- CreateIndex
CREATE INDEX "Course_departmentId_idx" ON "public"."Course"("departmentId");

-- CreateIndex
CREATE INDEX "Course_facultyId_idx" ON "public"."Course"("facultyId");

-- CreateIndex
CREATE INDEX "Course_programmeId_idx" ON "public"."Course"("programmeId");

-- CreateIndex
CREATE INDEX "Course_levelId_idx" ON "public"."Course"("levelId");

-- CreateIndex
CREATE INDEX "CourseOffering_courseId_idx" ON "public"."CourseOffering"("courseId");

-- CreateIndex
CREATE INDEX "CourseOffering_sessionId_idx" ON "public"."CourseOffering"("sessionId");

-- CreateIndex
CREATE INDEX "CourseOffering_semesterId_idx" ON "public"."CourseOffering"("semesterId");

-- CreateIndex
CREATE INDEX "CourseOffering_facultyId_idx" ON "public"."CourseOffering"("facultyId");

-- CreateIndex
CREATE INDEX "CourseOffering_departmentId_idx" ON "public"."CourseOffering"("departmentId");

-- CreateIndex
CREATE INDEX "CourseOffering_programmeId_idx" ON "public"."CourseOffering"("programmeId");

-- CreateIndex
CREATE INDEX "CourseOffering_levelId_idx" ON "public"."CourseOffering"("levelId");

-- CreateIndex
CREATE INDEX "CourseAssignment_courseOfferingId_idx" ON "public"."CourseAssignment"("courseOfferingId");

-- CreateIndex
CREATE INDEX "CourseAssignment_lecturerStaffProfileId_idx" ON "public"."CourseAssignment"("lecturerStaffProfileId");

-- CreateIndex
CREATE INDEX "AdviserAssignment_staffProfileId_idx" ON "public"."AdviserAssignment"("staffProfileId");

-- CreateIndex
CREATE INDEX "AdviserAssignment_facultyId_idx" ON "public"."AdviserAssignment"("facultyId");

-- CreateIndex
CREATE INDEX "AdviserAssignment_departmentId_idx" ON "public"."AdviserAssignment"("departmentId");

-- CreateIndex
CREATE INDEX "AdviserAssignment_programmeId_idx" ON "public"."AdviserAssignment"("programmeId");

-- CreateIndex
CREATE INDEX "AdviserAssignment_levelId_idx" ON "public"."AdviserAssignment"("levelId");

-- CreateIndex
CREATE INDEX "AdviserAssignment_sessionId_idx" ON "public"."AdviserAssignment"("sessionId");

-- CreateIndex
CREATE INDEX "AdviserAssignment_semesterId_idx" ON "public"."AdviserAssignment"("semesterId");

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "public"."Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "public"."Programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "public"."Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOffering" ADD CONSTRAINT "CourseOffering_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOffering" ADD CONSTRAINT "CourseOffering_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOffering" ADD CONSTRAINT "CourseOffering_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOffering" ADD CONSTRAINT "CourseOffering_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "public"."Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOffering" ADD CONSTRAINT "CourseOffering_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOffering" ADD CONSTRAINT "CourseOffering_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "public"."Programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOffering" ADD CONSTRAINT "CourseOffering_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "public"."Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseAssignment" ADD CONSTRAINT "CourseAssignment_courseOfferingId_fkey" FOREIGN KEY ("courseOfferingId") REFERENCES "public"."CourseOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseAssignment" ADD CONSTRAINT "CourseAssignment_lecturerStaffProfileId_fkey" FOREIGN KEY ("lecturerStaffProfileId") REFERENCES "public"."StaffProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdviserAssignment" ADD CONSTRAINT "AdviserAssignment_staffProfileId_fkey" FOREIGN KEY ("staffProfileId") REFERENCES "public"."StaffProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdviserAssignment" ADD CONSTRAINT "AdviserAssignment_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "public"."Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdviserAssignment" ADD CONSTRAINT "AdviserAssignment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdviserAssignment" ADD CONSTRAINT "AdviserAssignment_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "public"."Programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdviserAssignment" ADD CONSTRAINT "AdviserAssignment_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "public"."Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdviserAssignment" ADD CONSTRAINT "AdviserAssignment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."AcademicSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdviserAssignment" ADD CONSTRAINT "AdviserAssignment_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
