"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { levelSchema } from "@/modules/academics/validators/level-schema";
import { isChecked } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function updateLevelAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Level ID is required.");
  }

  const parsed = levelSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    numericValue: formData.get("numericValue"),
    isActive: isChecked(formData, "isActive"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid level data.");
  }

  const actorId = await getActorId();

  const before = await prisma.level.findUnique({
    where: { id },
  });

  const level = await prisma.level.update({
    where: { id },
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "LEVEL_UPDATED",
    entityType: "LEVEL",
    entityId: level.id,
    summary: `Updated level ${level.name}`,
    beforeJson: before,
    afterJson: level,
  });

  redirect("/admin/academics/levels");
}