import { prisma } from "@/lib/db/prisma";

type Input = {
  studentProfileId: string;
};

export async function getActiveRegistrationHolds({
  studentProfileId,
}: Input) {
  return prisma.financeHold.findMany({
    where: {
      studentProfileId,
      isActive: true,
    },
    orderBy: {
      placedAt: "desc",
    },
  });
}