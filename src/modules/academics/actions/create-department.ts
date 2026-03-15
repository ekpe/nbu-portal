"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { departmentSchema } from "@/modules/academics/validators/department-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function createDepartmentAction(formData: FormData): Promise<void> {
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

  const department = await prisma.department.create({
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "DEPARTMENT_CREATED",
    entityType: "DEPARTMENT",
    entityId: department.id,
    summary: `Created department ${department.name}`,
    afterJson: department,
  });

  redirect("/admin/academics/departments");
}