"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function archiveDepartmentAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Department ID is required.");

  const actorId = await getActorId();

  const before = await prisma.department.findUnique({
    where: { id },
  });

  const department = await prisma.department.update({
    where: { id },
    data: { isActive: false },
  });

  await writeAuditLog({
    actorId,
    action: "DEPARTMENT_ARCHIVED",
    entityType: "DEPARTMENT",
    entityId: department.id,
    summary: `Archived department ${department.name}`,
    beforeJson: before,
    afterJson: department,
  });

  redirect("/admin/academics/departments");
}