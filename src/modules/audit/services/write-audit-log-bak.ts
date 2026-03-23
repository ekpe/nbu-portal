import { prisma } from "@/lib/db/prisma";

type WriteAuditLogInput = {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary?: string;
  beforeJson?: unknown;
  afterJson?: unknown;
};

export async function writeAuditLog(input: WriteAuditLogInput) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      summary: input.summary,
      beforeJson: input.beforeJson as object | undefined,
      afterJson: input.afterJson as object | undefined,
    },
  });
}