import { prisma } from "@/lib/db/prisma";

type Input = {
  studentFeeProfileId: string;
};

export async function getActiveRegistrationHolds({
  studentFeeProfileId,
}: Input) {
  return prisma.registrationHold.findMany({
    where: {
      studentFeeProfileId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}