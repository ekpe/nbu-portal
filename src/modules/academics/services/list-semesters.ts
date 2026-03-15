import { prisma } from "@/lib/db/prisma";

export async function listSemesters() {
  return prisma.semester.findMany({
    orderBy: { createdAt: "desc" },
  });
}