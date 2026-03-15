import { prisma } from "@/lib/db/prisma";

export async function listDepartments() {
  return prisma.department.findMany({
    include: {
      faculty: true,
    },
    orderBy: { name: "asc" },
  });
}