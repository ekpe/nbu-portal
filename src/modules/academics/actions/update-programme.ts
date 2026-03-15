"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { programmeSchema } from "@/modules/academics/validators/programme-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function updateProgrammeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Programme ID is required.");
  }

  const durationYearsRaw = emptyToUndefined(formData.get("durationYears"));

  const parsed = programmeSchema.safeParse({
    facultyId: formData.get("facultyId"),
    departmentId: formData.get("departmentId"),
    code: formData.get("code"),
    name: formData.get("name"),
    awardType: emptyToUndefined(formData.get("awardType")),
    durationYears: durationYearsRaw ? Number(durationYearsRaw) : undefined,
    isActive: isChecked(formData, "isActive"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid programme data.");
  }

  const actorId = await getActorId();

  const before = await prisma.programme.findUnique({
    where: { id },
  });

  const programme = await prisma.programme.update({
    where: { id },
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "PROGRAMME_UPDATED",
    entityType: "PROGRAMME",
    entityId: programme.id,
    summary: `Updated programme ${programme.name}`,
    beforeJson: before,
    afterJson: programme,
  });

  redirect("/admin/academics/programmes");
}