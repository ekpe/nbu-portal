import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { prisma } from "@/lib/db/prisma";

export default async function StudentResultsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!studentProfile) redirect("/student/dashboard");

  const entries = await prisma.resultEntry.findMany({
    where: {
      studentProfileId: studentProfile.id,
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
              session: true,
              semester: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const gpas = await prisma.gPARecord.findMany({
    where: { studentProfileId: studentProfile.id },
    include: {
      session: true,
      semester: true,
    },
    orderBy: {
      calculatedAt: "desc",
    },
  });

  const latestCgpa = await prisma.cGPARecord.findFirst({
    where: { studentProfileId: studentProfile.id },
    orderBy: { calculatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">My Results</h1>
          <p className="mt-2 text-gray-600">
            Latest CGPA: {latestCgpa ? latestCgpa.cgpa.toFixed(2) : "0.00"}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Session</th>
                <th className="px-4 py-3 text-left">Semester</th>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Units</th>
                <th className="px-4 py-3 text-left">CA</th>
                <th className="px-4 py-3 text-left">Exam</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Grade</th>
                <th className="px-4 py-3 text-left">Remark</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t">
                  <td className="px-4 py-3">{entry.resultSheet.offering.session.name}</td>
                  <td className="px-4 py-3">{entry.resultSheet.offering.semester.name}</td>
                  <td className="px-4 py-3">
                    {entry.resultSheet.offering.course.courseCode} - {entry.resultSheet.offering.course.title}
                  </td>
                  <td className="px-4 py-3">{entry.resultSheet.offering.course.creditUnits}</td>
                  <td className="px-4 py-3">{entry.caScore ?? "-"}</td>
                  <td className="px-4 py-3">{entry.examScore ?? "-"}</td>
                  <td className="px-4 py-3">{entry.totalScore ?? "-"}</td>
                  <td className="px-4 py-3">{entry.letterGrade ?? "-"}</td>
                  <td className="px-4 py-3">{entry.remark ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Session</th>
                <th className="px-4 py-3 text-left">Semester</th>
                <th className="px-4 py-3 text-left">GPA</th>
                <th className="px-4 py-3 text-left">Units Attempted</th>
                <th className="px-4 py-3 text-left">Units Passed</th>
              </tr>
            </thead>
            <tbody>
              {gpas.map((gpa) => (
                <tr key={gpa.id} className="border-t">
                  <td className="px-4 py-3">{gpa.session.name}</td>
                  <td className="px-4 py-3">{gpa.semester.name}</td>
                  <td className="px-4 py-3">{gpa.gpa.toFixed(2)}</td>
                  <td className="px-4 py-3">{gpa.totalUnitsAttempted}</td>
                  <td className="px-4 py-3">{gpa.totalUnitsPassed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}