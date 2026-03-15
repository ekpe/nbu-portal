"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { semesterSchema } from "@/modules/academics/validators/semester-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function createSemesterAction(formData: FormData): Promise<void> {
  const parsed = semesterSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    startDate: emptyToUndefined(formData.get("startDate")),
    endDate: emptyToUndefined(formData.get("endDate")),
    isActive: isChecked(formData, "isActive"),
    isCurrent: isChecked(formData, "isCurrent"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid semester data.");
  }

  const actorId = await getActorId();

  if (parsed.data.isCurrent) {
    await prisma.semester.updateMany({
      data: { isCurrent: false },
    });
  }

  const semester = await prisma.semester.create({
    data: {
      code: parsed.data.code,
      name: parsed.data.name,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      isActive: parsed.data.isActive,
      isCurrent: parsed.data.isCurrent,
    },
  });

  await writeAuditLog({
    actorId,
    action: "SEMESTER_CREATED",
    entityType: "SEMESTER",
    entityId: semester.id,
    summary: `Created semester ${semester.name}`,
    afterJson: semester,
  });

  redirect("/admin/academics/semesters");
}