import { prisma } from "@/lib/db/prisma";

export async function listFaculties() {
  return prisma.faculty.findMany({
    orderBy: { name: "asc" },
  });
}