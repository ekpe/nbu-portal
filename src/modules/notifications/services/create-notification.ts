import { prisma } from "@/lib/db/prisma";

type CreateNotificationInput = {
  userId: string;
  title: string;
  message: string;
};

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
      isRead: false,
    },
  });
}