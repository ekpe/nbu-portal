import { prisma } from "@/lib/db/prisma";

type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  computedTotalCredits: number;
};

export async function validateRegistration(registrationId: string): Promise<ValidationResult> {
  const registration = await prisma.courseRegistration.findUnique({
    where: { id: registrationId },
    include: {
      items: {
        include: {
          course: true,
          courseOffering: true,
        },
      },
      session: true,
      semester: true,
      enrollment: true,
    },
  });

  if (!registration) {
    return {
      valid: false,
      errors: ["Registration not found."],
      warnings: [],
      computedTotalCredits: 0,
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  if (registration.items.length === 0) {
    errors.push("At least one course must be selected.");
  }

  const totalCredits = registration.items.reduce(
    (sum, item) => sum + item.creditUnits,
    0,
  );

  if (totalCredits <= 0) {
    errors.push("Total credits must be greater than zero.");
  }

  const seen = new Set<string>();
  for (const item of registration.items) {
    if (seen.has(item.courseId)) {
      errors.push(`Duplicate course detected: ${item.course.courseCode}`);
    }
    seen.add(item.courseId);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    computedTotalCredits: totalCredits,
  };
}