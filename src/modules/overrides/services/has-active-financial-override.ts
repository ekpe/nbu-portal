import { prisma } from "@/lib/db/prisma";

type Input = {
  studentFeeProfileId: string;
};

export async function hasActiveFinancialOverride({
  studentFeeProfileId,
}: Input) {
  const now = new Date();

  const override = await prisma.financialOverride.findFirst({
    where: {
      studentFeeProfileId,
      status: "APPROVED",
      OR: [
        {
          effectiveFrom: null,
          expiresAt: null,
        },
        {
          effectiveFrom: { lte: now },
          expiresAt: null,
        },
        {
          effectiveFrom: null,
          expiresAt: { gte: now },
        },
        {
          effectiveFrom: { lte: now },
          expiresAt: { gte: now },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Boolean(override);
}