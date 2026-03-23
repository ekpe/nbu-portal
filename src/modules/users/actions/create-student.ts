"use server";

import { redirect } from "next/navigation";
import * as argon2 from "argon2";
import { prisma } from "@/lib/db/prisma";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function createStudentAction(formData: FormData): Promise<void> {
  const actorId = await getActorId();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const matricNumber = String(formData.get("matricNumber") ?? "").trim();
  const admissionYearRaw = String(formData.get("admissionYear") ?? "").trim();
  const facultyId = String(formData.get("facultyId") ?? "").trim();
  const departmentId = String(formData.get("departmentId") ?? "").trim();
  const programmeId = String(formData.get("programmeId") ?? "").trim();
  const levelId = String(formData.get("levelId") ?? "").trim();

  if (!firstName || !lastName || !email || !password || !matricNumber) {
    throw new Error("Required fields are missing.");
  }

  const passwordHash = await argon2.hash(password);

  const studentRole = await prisma.role.findUniqueOrThrow({
    where: { code: "STUDENT" },
  });

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      isActive: true,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: studentRole.id,
      isActive: true,
    },
  });

  const profile = await prisma.studentProfile.create({
    data: {
      userId: user.id,
      matricNumber,
      admissionYear: admissionYearRaw ? Number(admissionYearRaw) : null,
      currentFacultyId: facultyId || null,
      currentDepartmentId: departmentId || null,
      currentProgrammeId: programmeId || null,
      currentLevelId: levelId || null,
      status: "ACTIVE",
    },
  });

  await writeAuditLog({
    actorId,
    action: "STUDENT_CREATED",
    entityType: "STUDENT_PROFILE",
    entityId: profile.id,
    summary: `Created student ${firstName} ${lastName}`,
    afterJson: profile,
  });

  redirect("/admin/users/students");
}