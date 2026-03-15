"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function restoreCourseAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Course ID is required.");

  const actorId = await getActorId();
  const before = await prisma.course.findUnique({ where: { id } });

  const course = await prisma.course.update({
    where: { id },
    data: { isActive: true },
  });

  await writeAuditLog({
    actorId,
    action: "COURSE_RESTORED",
    entityType: "COURSE",
    entityId: course.id,
    summary: `Restored course ${course.courseCode}`,
    beforeJson: before,
    afterJson: course,
  });

  redirect("/admin/courses");
}