"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function restoreLevelAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Level ID is required.");

  const actorId = await getActorId();

  const before = await prisma.level.findUnique({
    where: { id },
  });

  const level = await prisma.level.update({
    where: { id },
    data: { isActive: true },
  });

  await writeAuditLog({
    actorId,
    action: "LEVEL_RESTORED",
    entityType: "LEVEL",
    entityId: level.id,
    summary: `Restored level ${level.name}`,
    beforeJson: before,
    afterJson: level,
  });

  redirect("/admin/academics/levels");
}