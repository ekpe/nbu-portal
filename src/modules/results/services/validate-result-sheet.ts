import { prisma } from "@/lib/db/prisma";

export async function validateResultSheet(resultSheetId: string) {
  const sheet = await prisma.resultSheet.findUnique({
    where: { id: resultSheetId },
    include: {
      entries: true,
    },
  });

  if (!sheet) {
    return { valid: false, errors: ["Result sheet not found."], warnings: [] as string[] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  if (sheet.entries.length === 0) {
    errors.push("Result sheet must contain at least one entry.");
  }

  const seen = new Set<string>();

  for (const entry of sheet.entries) {
    if (seen.has(entry.studentProfileId)) {
      errors.push("Duplicate student entry detected.");
    }
    seen.add(entry.studentProfileId);

    if (entry.caScore != null && (entry.caScore < 0 || entry.caScore > 30)) {
      errors.push("CA score must be between 0 and 30.");
    }

    if (entry.examScore != null && (entry.examScore < 0 || entry.examScore > 70)) {
      errors.push("Exam score must be between 0 and 70.");
    }

    if (entry.totalScore != null && (entry.totalScore < 0 || entry.totalScore > 100)) {
      errors.push("Total score must be between 0 and 100.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}