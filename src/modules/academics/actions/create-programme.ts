"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { programmeSchema } from "@/modules/academics/validators/programme-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function createProgrammeAction(formData: FormData): Promise<void> {
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

  const programme = await prisma.programme.create({
    data: parsed.data,
  });

  await writeAuditLog({
    actorId,
    action: "PROGRAMME_CREATED",
    entityType: "PROGRAMME",
    entityId: programme.id,
    summary: `Created programme ${programme.name}`,
    afterJson: programme,
  });

  redirect("/admin/academics/programmes");
}