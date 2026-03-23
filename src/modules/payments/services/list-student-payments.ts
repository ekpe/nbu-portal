import { prisma } from "@/lib/db/prisma";

type Input = {
  studentProfileId: string;
  sessionId?: string;
  semesterId?: string;
};

export async function listStudentPayments({
  studentProfileId,
  sessionId,
  semesterId,
}: Input) {
  return prisma.paymentTransaction.findMany({
    where: {
      studentProfileId,
      ...(sessionId ? { sessionId } : {}),
      ...(semesterId ? { semesterId } : {}),
    },
    orderBy: {
      paymentDate: "desc",
    },
  });
}