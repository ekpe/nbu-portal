import { prisma } from "@/lib/db/prisma";

export async function rebuildTranscriptLedgerForStudent(studentProfileId: string) {
  await prisma.transcriptLedgerEntry.deleteMany({
    where: { studentProfileId },
  });

  const entries = await prisma.resultEntry.findMany({
    where: {
      studentProfileId,
      resultSheet: {
        status: "PUBLISHED",
      },
    },
    include: {
      resultSheet: {
        include: {
          offering: {
            include: {
              course: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  for (const entry of entries) {
    await prisma.transcriptLedgerEntry.create({
      data: {
        studentProfileId,
        sessionId: entry.resultSheet.sessionId,
        semesterId: entry.resultSheet.semesterId,
        courseId: entry.resultSheet.offering.course.id,
        resultEntryId: entry.id,
        courseCode: entry.resultSheet.offering.course.courseCode,
        courseTitle: entry.resultSheet.offering.course.title,
        creditUnits: entry.resultSheet.offering.course.creditUnits,
        totalScore: entry.totalScore,
        letterGrade: entry.letterGrade,
        gradePoint: entry.gradePoint,
        remark: entry.remark,
      },
    });
  }
}