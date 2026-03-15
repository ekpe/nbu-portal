"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function archiveCourseOfferingAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Offering ID is required.");

  const actorId = await getActorId();
  const before = await prisma.courseOffering.findUnique({ where: { id } });

  const offering = await prisma.courseOffering.update({
    where: { id },
    data: { isActive: false },
  });

  await writeAuditLog({
    actorId,
    action: "COURSE_OFFERING_ARCHIVED",
    entityType: "COURSE_OFFERING",
    entityId: offering.id,
    summary: `Archived course offering`,
    beforeJson: before,
    afterJson: offering,
  });

  redirect("/admin/course-offerings");
}