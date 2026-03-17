import { PrismaClient, RoleCode } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { code: RoleCode.SUPER_ADMIN, name: "Super Admin" },
    { code: RoleCode.DEAN, name: "Dean" },
    { code: RoleCode.HOD, name: "Head of Department" },
    { code: RoleCode.COURSE_ADVISER, name: "Course Adviser" },
    { code: RoleCode.LECTURER, name: "Lecturer" },
    { code: RoleCode.STUDENT, name: "Student" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name },
      create: role,
    });
  }

  const fcit = await prisma.faculty.upsert({
    where: { code: "FCIT" },
    update: {},
    create: {
      code: "FCIT",
      name: "Faculty of Computing and Information Technology",
      isActive: true,
    },
  });

  const csDept = await prisma.department.upsert({
    where: { code: "CSC" },
    update: {},
    create: {
      code: "CSC",
      name: "Computer Science",
      facultyId: fcit.id,
      isActive: true,
    },
  });

  const seDept = await prisma.department.upsert({
    where: { code: "SWE" },
    update: {},
    create: {
      code: "SWE",
      name: "Software Engineering",
      facultyId: fcit.id,
      isActive: true,
    },
  });

  const csProgramme = await prisma.programme.upsert({
    where: { code: "BSC-CS" },
    update: {},
    create: {
      code: "BSC-CS",
      name: "BSc Computer Science",
      facultyId: fcit.id,
      departmentId: csDept.id,
      durationYears: 4,
      isActive: true,
    },
  });

  await prisma.programme.upsert({
    where: { code: "BSC-SWE" },
    update: {},
    create: {
      code: "BSC-SWE",
      name: "BSc Software Engineering",
      facultyId: fcit.id,
      departmentId: seDept.id,
      durationYears: 4,
      isActive: true,
    },
  });

  const levels = [
    { code: "100", name: "100 Level", numericValue: 100 },
    { code: "200", name: "200 Level", numericValue: 200 },
    { code: "300", name: "300 Level", numericValue: 300 },
    { code: "400", name: "400 Level", numericValue: 400 },
  ];

  for (const level of levels) {
    await prisma.level.upsert({
      where: { code: level.code },
      update: level,
      create: level,
    });
  }

  await prisma.academicSession.upsert({
    where: { name: "2025/2026" },
    update: {
      isActive: true,
      isCurrent: true,
    },
    create: {
      name: "2025/2026",
      isActive: true,
      isCurrent: true,
    },
  });

  await prisma.semester.upsert({
    where: { code: "FIRST" },
    update: {
      name: "First Semester",
      isActive: true,
      isCurrent: true,
    },
    create: {
      code: "FIRST",
      name: "First Semester",
      isActive: true,
      isCurrent: true,
    },
  });

  await prisma.semester.upsert({
    where: { code: "SECOND" },
    update: {
      name: "Second Semester",
      isActive: true,
      isCurrent: false,
    },
    create: {
      code: "SECOND",
      name: "Second Semester",
      isActive: true,
      isCurrent: false,
    },
  });

  const passwordHash = await argon2.hash("Password123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@nbu.edu.ng" },
    update: {},
    create: {
      email: "admin@nbu.edu.ng",
      passwordHash,
      firstName: "System",
      lastName: "Admin",
      isActive: true,
    },
  });

  const lecturer = await prisma.user.upsert({
    where: { email: "lecturer@nbu.edu.ng" },
    update: {},
    create: {
      email: "lecturer@nbu.edu.ng",
      passwordHash,
      firstName: "John",
      lastName: "Lecturer",
      isActive: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@nbu.edu.ng" },
    update: {},
    create: {
      email: "student@nbu.edu.ng",
      passwordHash,
      firstName: "Jane",
      lastName: "Student",
      isActive: true,
    },
  });

  const superAdminRole = await prisma.role.findUniqueOrThrow({
    where: { code: RoleCode.SUPER_ADMIN },
  });

  const lecturerRole = await prisma.role.findUniqueOrThrow({
    where: { code: RoleCode.LECTURER },
  });

  const studentRole = await prisma.role.findUniqueOrThrow({
    where: { code: RoleCode.STUDENT },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: superAdminRole.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: lecturer.id,
        roleId: lecturerRole.id,
      },
    },
    update: {},
    create: {
      userId: lecturer.id,
      roleId: lecturerRole.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: student.id,
        roleId: studentRole.id,
      },
    },
    update: {},
    create: {
      userId: student.id,
      roleId: studentRole.id,
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: lecturer.id },
    update: {},
    create: {
      userId: lecturer.id,
      staffNumber: "STF001",
      title: "Mr.",
      departmentId: csDept.id,
      facultyId: fcit.id,
      employmentStatus: "ACTIVE",
    },
  });

  const level100 = await prisma.level.findUniqueOrThrow({
    where: { code: "100" },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      matricNumber: "NBU/25/0001",
      admissionYear: 2025,
      currentLevelId: level100.id,
      currentProgrammeId: csProgramme.id,
      currentDepartmentId: csDept.id,
      currentFacultyId: fcit.id,
      status: "ACTIVE",
    },
  });

  const currentSession = await prisma.academicSession.findFirstOrThrow({
    where: { isCurrent: true },
  });

  const currentSemester = await prisma.semester.findFirstOrThrow({
    where: { isCurrent: true },
  });

  const studentProfile = await prisma.studentProfile.findUniqueOrThrow({
    where: { userId: student.id },
  });  

  const existingEnrollment = await prisma.studentProgrammeEnrollment.findFirst({
    where: {
      studentProfileId: studentProfile.id,
      sessionId: currentSession.id,
      semesterId: currentSemester.id,
    },
  });

  if (!existingEnrollment) {
    await prisma.studentProgrammeEnrollment.create({
      data: {
        studentProfileId: studentProfile.id,
        programmeId: csProgramme.id,
        departmentId: csDept.id,
        facultyId: fcit.id,
        levelId: level100.id,
        sessionId: currentSession.id,
        semesterId: currentSemester.id,
        enrollmentStatus: "ACTIVE",
        isCurrent: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });