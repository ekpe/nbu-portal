import { prisma } from "@/lib/db/prisma";

type BulkNotificationInput = {
  userIds: string[];
  title: string;
  message: string;
};

export async function createBulkNotifications(input: BulkNotificationInput) {
  if (input.userIds.length === 0) return;

  await prisma.notification.createMany({
    data: input.userIds.map((userId) => ({
      userId,
      title: input.title,
      message: input.message,
      isRead: false,
    })),
  });
}