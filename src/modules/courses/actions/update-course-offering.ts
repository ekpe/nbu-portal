"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { courseOfferingSchema } from "@/modules/courses/validators/course-offering-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function updateCourseOfferingAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Offering ID is required.");

  const cap = emptyToUndefined(formData.get("registrationCap"));

  const parsed = courseOfferingSchema.safeParse({
    courseId: formData.get("courseId"),
    sessionId: formData.get("sessionId"),
    semesterId: formData.get("semesterId"),
    facultyId: formData.get("facultyId"),
    departmentId: formData.get("departmentId"),
    programmeId: emptyToUndefined(formData.get("programmeId")),
    levelId: emptyToUndefined(formData.get("levelId")),
    registrationCap: cap ? Number(cap) : undefined,
    isActive: isChecked(formData, "isActive"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid course offering data.");
  }

  const actorId = await getActorId();
  const before = await prisma.courseOffering.findUnique({ where: { id } });

  const offering = await prisma.courseOffering.update({
    where: { id },
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "COURSE_OFFERING_UPDATED",
    entityType: "COURSE_OFFERING",
    entityId: offering.id,
    summary: `Updated course offering`,
    beforeJson: before,
    afterJson: offering,
  });

  redirect("/admin/course-offerings");
}