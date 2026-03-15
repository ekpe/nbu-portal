"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { sessionSchema } from "@/modules/academics/validators/session-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function createSessionAction(formData: FormData): Promise<void> {
  const parsed = sessionSchema.safeParse({
    name: formData.get("name"),
    startDate: emptyToUndefined(formData.get("startDate")),
    endDate: emptyToUndefined(formData.get("endDate")),
    isActive: isChecked(formData, "isActive"),
    isCurrent: isChecked(formData, "isCurrent"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid session data.");
  }

  const actorId = await getActorId();

  if (parsed.data.isCurrent) {
    await prisma.academicSession.updateMany({
      data: { isCurrent: false },
    });
  }

  const session = await prisma.academicSession.create({
    data: {
      name: parsed.data.name,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      isActive: parsed.data.isActive,
      isCurrent: parsed.data.isCurrent,
    },
  });

  await writeAuditLog({
    actorId,
    action: "SESSION_CREATED",
    entityType: "ACADEMIC_SESSION",
    entityId: session.id,
    summary: `Created academic session ${session.name}`,
    afterJson: session,
  });

  redirect("/admin/academics/sessions");
}