import { prisma } from "@/lib/db/prisma";

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { id: "desc" },
    take: 50,
  });
}