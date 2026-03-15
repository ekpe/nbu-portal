"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { courseAssignmentSchema } from "@/modules/assignments/validators/course-assignment-schema";
import { isChecked } from "@/lib/utils/form";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function createCourseAssignmentAction(formData: FormData): Promise<void> {
  const actorId = await getActorId();

  const parsed = courseAssignmentSchema.safeParse({
    courseOfferingId: formData.get("courseOfferingId"),
    lecturerStaffProfileId: formData.get("lecturerStaffProfileId"),
    isPrimary: isChecked(formData, "isPrimary"),
    isActive: isChecked(formData, "isActive"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid course assignment.");
  }

  const assignment = await prisma.courseAssignment.create({
    data: {
      ...parsed.data,
      assignedByUserId: actorId ?? undefined,
    },
  });

  await writeAuditLog({
    actorId,
    action: "COURSE_ASSIGNMENT_CREATED",
    entityType: "COURSE_ASSIGNMENT",
    entityId: assignment.id,
    summary: "Assigned lecturer to course offering",
    afterJson: assignment,
  });

  redirect("/admin/course-assignments");
}