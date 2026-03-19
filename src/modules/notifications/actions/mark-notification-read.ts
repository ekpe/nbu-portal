"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function markNotificationReadAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Notification ID is required.");

  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification) throw new Error("Notification not found.");
  if (notification.userId !== session.user.id) throw new Error("Unauthorized.");

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}