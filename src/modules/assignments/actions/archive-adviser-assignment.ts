"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getActorId } from "@/lib/auth/get-actor-id";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";

export async function archiveAdviserAssignmentAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Adviser assignment ID is required.");

  const actorId = await getActorId();
  const before = await prisma.adviserAssignment.findUnique({ where: { id } });

  const assignment = await prisma.adviserAssignment.update({
    where: { id },
    data: { isActive: false },
  });

  await writeAuditLog({
    actorId,
    action: "ADVISER_ASSIGNMENT_ARCHIVED",
    entityType: "ADVISER_ASSIGNMENT",
    entityId: assignment.id,
    summary: "Archived adviser assignment",
    beforeJson: before,
    afterJson: assignment,
  });

  redirect("/admin/adviser-assignments");
}