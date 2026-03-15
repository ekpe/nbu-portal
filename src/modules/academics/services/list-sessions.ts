import { prisma } from "@/lib/db/prisma";

export async function listSessions() {
  return prisma.academicSession.findMany({
    orderBy: { createdAt: "desc" },
  });
}