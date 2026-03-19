import { prisma } from "@/lib/db/prisma";

export async function getRoleAwareRegistrationQueue(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        where: { isActive: true },
        include: { role: true },
      },
      staffProfile: true,
    },
  });

  if (!user) return [];

  const roleCodes = user.roles.map((r) => r.role.code);

  let targetStatuses: string[] = [];

  if (roleCodes.includes("COURSE_ADVISER")) targetStatuses.push("SUBMITTED");
  if (roleCodes.includes("HOD")) targetStatuses.push("ADVISER_APPROVED");
  if (roleCodes.includes("DEAN")) targetStatuses.push("HOD_APPROVED");

  if (targetStatuses.length === 0) return [];

  return prisma.courseRegistration.findMany({
    where: {
      status: { in: targetStatuses },
    },
    include: {
      studentProfile: {
        include: {
          user: true,
          programme: true,
          level: true,
        },
      },
      session: true,
      semester: true,
      items: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });
}