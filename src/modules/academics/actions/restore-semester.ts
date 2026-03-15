"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function restoreSemesterAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Semester ID is required.");

  const actorId = await getActorId();

  const before = await prisma.semester.findUnique({
    where: { id },
  });

  const semester = await prisma.semester.update({
    where: { id },
    data: { isActive: true },
  });

  await writeAuditLog({
    actorId,
    action: "SEMESTER_RESTORED",
    entityType: "SEMESTER",
    entityId: semester.id,
    summary: `Restored semester ${semester.name}`,
    beforeJson: before,
    afterJson: semester,
  });

  redirect("/admin/academics/semesters");
}