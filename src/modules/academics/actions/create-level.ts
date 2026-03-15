"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { levelSchema } from "@/modules/academics/validators/level-schema";
import { isChecked } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function createLevelAction(formData: FormData): Promise<void> {
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

  const level = await prisma.level.create({
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "LEVEL_CREATED",
    entityType: "LEVEL",
    entityId: level.id,
    summary: `Created level ${level.name}`,
    afterJson: level,
  });

  redirect("/admin/academics/levels");
}