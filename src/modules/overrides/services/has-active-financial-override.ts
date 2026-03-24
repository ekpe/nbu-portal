import { prisma } from "@/lib/db/prisma";

type Input = {
  studentProfileId: string;
};

export async function hasActiveFinancialOverride({
  studentProfileId,
}: Input): Promise<boolean> {
  const override = await prisma.financeOverrideRequest.findFirst({
    where: {
      studentProfileId,
      status: "APPROVED",
    },
    orderBy: {
      approvedAt: "desc",
    },
  });

  return !!override;
}