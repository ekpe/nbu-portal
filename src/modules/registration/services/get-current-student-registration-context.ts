import { prisma } from "@/lib/db/prisma";

export async function getCurrentStudentRegistrationContext(userId: string) {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  });

  if (!studentProfile) {
    return null;
  }

  const [session, semester] = await Promise.all([
    prisma.academicSession.findFirst({
      where: { isCurrent: true, isActive: true },
    }),
    prisma.semester.findFirst({
      where: { isCurrent: true, isActive: true },
    }),
  ]);

  if (!session || !semester) {
    return null;
  }

  const enrollment = await prisma.studentProgrammeEnrollment.findFirst({
    where: {
      studentProfileId: studentProfile.id,
      sessionId: session.id,
      semesterId: semester.id,
      isCurrent: true,
      enrollmentStatus: "ACTIVE",
    },
    include: {
      faculty: true,
      department: true,
      programme: true,
      level: true,
      session: true,
      semester: true,
    },
  });

  return {
    studentProfile,
    session,
    semester,
    enrollment,
  };
}