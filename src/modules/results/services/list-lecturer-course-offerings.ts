import { prisma } from "@/lib/db/prisma";

export async function listLecturerCourseOfferings(userId: string) {
  const staffProfile = await prisma.staffProfile.findUnique({
    where: { userId },
  });

  if (!staffProfile) return [];

  return prisma.courseAssignment.findMany({
    where: {
      lecturerStaffProfileId: staffProfile.id,
      isActive: true,
      offering: {
        isActive: true,
      },
    },
    include: {
      offering: {
        include: {
          course: true,
          session: true,
          semester: true,
          department: true,
          programme: true,
          level: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}