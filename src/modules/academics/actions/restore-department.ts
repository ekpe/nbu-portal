"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function restoreDepartmentAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Department ID is required.");

  const actorId = await getActorId();

  const before = await prisma.department.findUnique({
    where: { id },
  });

  const department = await prisma.department.update({
    where: { id },
    data: { isActive: true },
  });

  await writeAuditLog({
    actorId,
    action: "DEPARTMENT_RESTORED",
    entityType: "DEPARTMENT",
    entityId: department.id,
    summary: `Restored department ${department.name}`,
    beforeJson: before,
    afterJson: department,
  });

  redirect("/admin/academics/departments");
}