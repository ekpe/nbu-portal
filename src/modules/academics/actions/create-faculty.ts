"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { facultySchema } from "@/modules/academics/validators/faculty-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function createFacultyAction(formData: FormData): Promise<void> {
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

  const faculty = await prisma.faculty.create({
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "FACULTY_CREATED",
    entityType: "FACULTY",
    entityId: faculty.id,
    summary: `Created faculty ${faculty.name}`,
    afterJson: faculty,
  });

  redirect("/admin/academics/faculties");
}