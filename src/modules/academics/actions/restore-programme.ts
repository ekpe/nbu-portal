"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function restoreProgrammeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Programme ID is required.");

  const actorId = await getActorId();

  const before = await prisma.programme.findUnique({
    where: { id },
  });

  const programme = await prisma.programme.update({
    where: { id },
    data: { isActive: true },
  });

  await writeAuditLog({
    actorId,
    action: "PROGRAMME_RESTORED",
    entityType: "PROGRAMME",
    entityId: programme.id,
    summary: `Restored programme ${programme.name}`,
    beforeJson: before,
    afterJson: programme,
  });

  redirect("/admin/academics/programmes");
}