import { prisma } from "@/lib/db/prisma";

export async function listStaffAssignmentsByUserId(userId: string) {
  const staff = await prisma.staffProfile.findUnique({
    where: { userId },
  });

  if (!staff) {
    return {
      courseAssignments: [],
      adviserAssignments: [],
    };
  }

  const [courseAssignments, adviserAssignments] = await Promise.all([
    prisma.courseAssignment.findMany({
      where: {
        lecturerStaffProfileId: staff.id,
        isActive: true,
      },
      include: {
        offering: {
          include: {
            course: true,
            session: true,
            semester: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.adviserAssignment.findMany({
      where: {
        staffProfileId: staff.id,
        isActive: true,
      },
      include: {
        faculty: true,
        department: true,
        programme: true,
        level: true,
        session: true,
        semester: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    courseAssignments,
    adviserAssignments,
  };
}