"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function archiveSessionAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Session ID is required.");

  const actorId = await getActorId();

  const before = await prisma.academicSession.findUnique({
    where: { id },
  });

  const session = await prisma.academicSession.update({
    where: { id },
    data: { isActive: false, isCurrent: false },
  });

  await writeAuditLog({
    actorId,
    action: "SESSION_ARCHIVED",
    entityType: "ACADEMIC_SESSION",
    entityId: session.id,
    summary: `Archived academic session ${session.name}`,
    beforeJson: before,
    afterJson: session,
  });

  redirect("/admin/academics/sessions");
}