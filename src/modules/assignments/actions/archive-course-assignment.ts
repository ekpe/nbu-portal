"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function archiveCourseAssignmentAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Course assignment ID is required.");

  const actorId = await getActorId();
  const before = await prisma.courseAssignment.findUnique({ where: { id } });

  const assignment = await prisma.courseAssignment.update({
    where: { id },
    data: { isActive: false },
  });

  await writeAuditLog({
    actorId,
    action: "COURSE_ASSIGNMENT_ARCHIVED",
    entityType: "COURSE_ASSIGNMENT",
    entityId: assignment.id,
    summary: "Archived course assignment",
    beforeJson: before,
    afterJson: assignment,
  });

  redirect("/admin/course-assignments");
}