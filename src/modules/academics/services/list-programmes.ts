import { prisma } from "@/lib/db/prisma";

export async function listProgrammes() {
  return prisma.programme.findMany({
    include: {
      faculty: true,
      department: true,
    },
    orderBy: { name: "asc" },
  });
}