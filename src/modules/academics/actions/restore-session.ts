"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function restoreSessionAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Session ID is required.");

  const actorId = await getActorId();

  const before = await prisma.academicSession.findUnique({
    where: { id },
  });

  const session = await prisma.academicSession.update({
    where: { id },
    data: { isActive: true },
  });

  await writeAuditLog({
    actorId,
    action: "SESSION_RESTORED",
    entityType: "ACADEMIC_SESSION",
    entityId: session.id,
    summary: `Restored academic session ${session.name}`,
    beforeJson: before,
    afterJson: session,
  });

  redirect("/admin/academics/sessions");
}