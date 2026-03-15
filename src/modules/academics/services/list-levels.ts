import { prisma } from "@/lib/db/prisma";

export async function listLevels() {
  return prisma.level.findMany({
    orderBy: { numericValue: "asc" },
  });
}