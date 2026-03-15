"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { departmentSchema } from "@/modules/academics/validators/department-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function updateDepartmentAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Department ID is required.");
  }

  const parsed = departmentSchema.safeParse({
    facultyId: formData.get("facultyId"),
    code: formData.get("code"),
    name: formData.get("name"),
    description: emptyToUndefined(formData.get("description")),
    isActive: isChecked(formData, "isActive"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid department data.");
  }

  const actorId = await getActorId();

  const before = await prisma.department.findUnique({
    where: { id },
  });

  const department = await prisma.department.update({
    where: { id },
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "DEPARTMENT_UPDATED",
    entityType: "DEPARTMENT",
    entityId: department.id,
    summary: `Updated department ${department.name}`,
    beforeJson: before,
    afterJson: department,
  });

  redirect("/admin/academics/departments");
}