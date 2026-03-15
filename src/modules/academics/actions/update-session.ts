"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { sessionSchema } from "@/modules/academics/validators/session-schema";
import { isChecked, emptyToUndefined } from "@/lib/utils/form";
import { writeAuditLog } from "@/modules/audit/services/write-audit-log";
import { getActorId } from "@/lib/auth/get-actor-id";

export async function updateSessionAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Session ID is required.");
  }

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

  const before = await prisma.academicSession.findUnique({
    where: { id },
  });

  if (parsed.data.isCurrent) {
    await prisma.academicSession.updateMany({
      where: {
        NOT: { id },
      },
      data: { isCurrent: false },
    });
  }

  const session = await prisma.academicSession.update({
    where: { id },
    data: {
      name: parsed.data.name,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      isActive: parsed.data.isActive,
      isCurrent: parsed.data.isCurrent,
    },
  });

  await writeAuditLog({
    actorId,
    action: "SESSION_UPDATED",
    entityType: "ACADEMIC_SESSION",
    entityId: session.id,
    summary: `Updated academic session ${session.name}`,
    beforeJson: before,
    afterJson: session,
  });

  redirect("/admin/academics/sessions");
}