import { getStudentCarryovers } from "./get-student-carryovers";
import { prisma } from "@/lib/db/prisma";

export async function validateRegistrationCarryoverRules(
  registrationId: string,
) {
  const registration = await prisma.courseRegistration.findUnique({
    where: { id: registrationId },
    include: {
      studentProfile: true,
      items: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!registration) {
    return { valid: false, errors: ["Registration not found."] };
  }

  const carryovers = await getStudentCarryovers(registration.studentProfileId);

  const carryoverCourseIds = new Set(
    carryovers.map((row) => row.resultSheet.offering.course.id),
  );

  const registeredCourseIds = new Set(registration.items.map((item) => item.courseId));

  const missingCarryovers = [...carryoverCourseIds].filter(
    (courseId) => !registeredCourseIds.has(courseId),
  );

  if (missingCarryovers.length > 0) {
    return {
      valid: false,
      errors: [
        "Student has carryover course(s) that must be included before submission.",
      ],
    };
  }

  return { valid: true, errors: [] as string[] };
}