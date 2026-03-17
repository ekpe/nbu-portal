import { prisma } from "@/lib/db/prisma";

export async function getLecturerResultContext(userId: string) {
  const staffProfile = await prisma.staffProfile.findUnique({
    where: { userId },
    include: { user: true },
  });

  if (!staffProfile) return null;

  return { staffProfile };
}