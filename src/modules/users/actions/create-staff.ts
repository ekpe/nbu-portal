"use server";

import { redirect } from "next/navigation";
import * as argon2 from "argon2";
import { prisma } from "@/lib/db/prisma";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function createStaffAction(formData: FormData): Promise<void> {
  const actorId = await getActorId();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const staffNumber = String(formData.get("staffNumber") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const qualification = String(formData.get("qualification") ?? "").trim();
  const rank = String(formData.get("rank") ?? "").trim();
  const facultyId = String(formData.get("facultyId") ?? "").trim();
  const departmentId = String(formData.get("departmentId") ?? "").trim();

  if (!firstName || !lastName || !email || !password || !staffNumber) {
    throw new Error("Required fields are missing.");
  }

  const passwordHash = await argon2.hash(password);

  const lecturerRole = await prisma.role.findUniqueOrThrow({
    where: { code: "LECTURER" },
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
      roleId: lecturerRole.id,
      isActive: true,
    },
  });

  const profile = await prisma.staffProfile.create({
    data: {
      userId: user.id,
      staffNumber,
      title: title || null,
      qualification: qualification || null,
      rank: rank || null,
      facultyId: facultyId || null,
      departmentId: departmentId || null,
      employmentStatus: "ACTIVE",
    },
  });

  await writeAuditLog({
    actorId,
    action: "STAFF_CREATED",
    entityType: "STAFF_PROFILE",
    entityId: profile.id,
    summary: `Created staff ${firstName} ${lastName}`,
    afterJson: profile,
  });

  redirect("/admin/users/staff");
}