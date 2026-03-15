"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { facultySchema } from "@/modules/academics/validators/faculty-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function updateFacultyAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Faculty ID is required.");
  }

  const parsed = facultySchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    description: emptyToUndefined(formData.get("description")),
    isActive: isChecked(formData, "isActive"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid faculty data.");
  }

  const actorId = await getActorId();

  const before = await prisma.faculty.findUnique({
    where: { id },
  });

  const faculty = await prisma.faculty.update({
    where: { id },
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "FACULTY_UPDATED",
    entityType: "FACULTY",
    entityId: faculty.id,
    summary: `Updated faculty ${faculty.name}`,
    beforeJson: before,
    afterJson: faculty,
  });

  redirect("/admin/academics/faculties");
}