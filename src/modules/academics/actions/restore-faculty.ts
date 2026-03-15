"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function restoreFacultyAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Faculty ID is required.");

  const actorId = await getActorId();

  const before = await prisma.faculty.findUnique({
    where: { id },
  });

  const faculty = await prisma.faculty.update({
    where: { id },
    data: { isActive: true },
  });

  await writeAuditLog({
    actorId,
    action: "FACULTY_RESTORED",
    entityType: "FACULTY",
    entityId: faculty.id,
    summary: `Restored faculty ${faculty.name}`,
    beforeJson: before,
    afterJson: faculty,
  });

  redirect("/admin/academics/faculties");
}