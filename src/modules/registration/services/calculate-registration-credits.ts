import { prisma } from "@/lib/db/prisma";

export async function calculateRegistrationCredits(registrationId: string) {
  const items = await prisma.courseRegistrationItem.findMany({
    where: { registrationId },
    select: { creditUnits: true },
  });

  return items.reduce((sum, item) => sum + item.creditUnits, 0);
}