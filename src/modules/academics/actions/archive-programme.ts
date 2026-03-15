"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function archiveProgrammeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Programme ID is required.");

  const actorId = await getActorId();

  const before = await prisma.programme.findUnique({
    where: { id },
  });

  const programme = await prisma.programme.update({
    where: { id },
    data: { isActive: false },
  });

  await writeAuditLog({
    actorId,
    action: "PROGRAMME_ARCHIVED",
    entityType: "PROGRAMME",
    entityId: programme.id,
    summary: `Archived programme ${programme.name}`,
    beforeJson: before,
    afterJson: programme,
  });

  redirect("/admin/academics/programmes");
}