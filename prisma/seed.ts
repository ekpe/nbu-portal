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