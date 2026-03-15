"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { adviserAssignmentSchema } from "@/modules/assignments/validators/adviser-assignment-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function createAdviserAssignmentAction(formData: FormData): Promise<void> {
  const actorId = await getActorId();

  const parsed = adviserAssignmentSchema.safeParse({
    staffProfileId: formData.get("staffProfileId"),
    facultyId: formData.get("facultyId"),
    departmentId: emptyToUndefined(formData.get("departmentId")),
    programmeId: emptyToUndefined(formData.get("programmeId")),
    levelId: emptyToUndefined(formData.get("levelId")),
    sessionId: formData.get("sessionId"),
    semesterId: formData.get("semesterId"),
    isActive: isChecked(formData, "isActive"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid adviser assignment.");
  }

  const assignment = await prisma.adviserAssignment.create({
    data: {
      ...parsed.data,
      assignedByUserId: actorId ?? undefined,
    },
  });

  await writeAuditLog({
    actorId,
    action: "ADVISER_ASSIGNMENT_CREATED",
    entityType: "ADVISER_ASSIGNMENT",
    entityId: assignment.id,
    summary: "Created adviser assignment",
    afterJson: assignment,
  });

  redirect("/admin/adviser-assignments");
}