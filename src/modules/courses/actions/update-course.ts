"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { courseSchema } from "@/modules/courses/validators/course-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function updateCourseAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Course ID is required.");

  const parsed = courseSchema.safeParse({
    courseCode: formData.get("courseCode"),
    title: formData.get("title"),
    description: emptyToUndefined(formData.get("description")),
    creditUnits: formData.get("creditUnits"),
    facultyId: formData.get("facultyId"),
    departmentId: formData.get("departmentId"),
    programmeId: emptyToUndefined(formData.get("programmeId")),
    levelId: emptyToUndefined(formData.get("levelId")),
    category: formData.get("category"),
    isCarryoverEligible: isChecked(formData, "isCarryoverEligible"),
    isElective: isChecked(formData, "isElective"),
    isActive: isChecked(formData, "isActive"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid course data.");
  }

  const actorId = await getActorId();
  const before = await prisma.course.findUnique({ where: { id } });

  const course = await prisma.course.update({
    where: { id },
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "COURSE_UPDATED",
    entityType: "COURSE",
    entityId: course.id,
    summary: `Updated course ${course.courseCode} - ${course.title}`,
    beforeJson: before,
    afterJson: course,
  });

  redirect("/admin/courses");
}