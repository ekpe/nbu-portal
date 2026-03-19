import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { prisma } from "@/lib/db/prisma";
import { PrintToolbar } from "@/components/results/print-toolbar";

export default async function StudentTranscriptPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!studentProfile) redirect("/student/dashboard");

  const ledger = await prisma.transcriptLedgerEntry.findMany({
    where: { studentProfileId: studentProfile.id },
    include: {
      session: true,
      semester: true,
    },
    orderBy: [
      { session: { name: "asc" } },
      { semester: { name: "asc" } },
      { courseCode: "asc" },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="space-y-6 p-6">
        <h1 className="text-2xl font-semibold">Transcript Ledger</h1>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Session</th>
                <th className="px-4 py-3 text-left">Semester</th>
                <th className="px-4 py-3 text-left">Course Code</th>
                <th className="px-4 py-3 text-left">Course Title</th>
                <th className="px-4 py-3 text-left">Units</th>
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left">Grade</th>
                <th className="px-4 py-3 text-left">Point</th>
                <th className="px-4 py-3 text-left">Remark</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-3">{row.session.name}</td>
                  <td className="px-4 py-3">{row.semester.name}</td>
                  <td className="px-4 py-3">{row.courseCode}</td>
                  <td className="px-4 py-3">{row.courseTitle}</td>
                  <td className="px-4 py-3">{row.creditUnits}</td>
                  <td className="px-4 py-3">{row.totalScore ?? "-"}</td>
                  <td className="px-4 py-3">{row.letterGrade ?? "-"}</td>
                  <td className="px-4 py-3">{row.gradePoint ?? "-"}</td>
                  <td className="px-4 py-3">{row.remark ?? "-"}</td>
                </tr>
              ))}

              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                    No transcript entries yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}