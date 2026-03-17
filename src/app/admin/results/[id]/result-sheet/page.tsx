import Link from "next/link";
import { notFound } from "next/navigation";
import { getResultSheetById } from "@/modules/results/services/get-result-sheet-by-id";
import { ReviewResultSheetForm } from "@/components/forms/review-result-sheet-form";

export default async function AdminResultSheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sheet = await getResultSheetById(id);

  if (!sheet) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Result Sheet Review</h1>
        <p className="mt-2 text-gray-600">
          {sheet.offering.course.courseCode} - {sheet.offering.course.title} | Status: {sheet.status}
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <p><strong>Course:</strong> {sheet.offering.course.title}</p>
        <p><strong>Course Code:</strong> {sheet.offering.course.courseCode}</p>
        <p><strong>Credit Unit:</strong> {sheet.offering.course.creditUnits}</p>
        <p><strong>Number of Students:</strong> {sheet.numberOfStudents}</p>
        <p><strong>Lecturer:</strong> {sheet.lecturer.user.firstName} {sheet.lecturer.user.lastName}</p>
      </div>

      <div className="flex gap-3">
        <Link href={`/admin/results/${sheet.id}/result-sheet`} className="rounded border px-4 py-2">
          Result Sheet View
        </Link>
        <Link href={`/admin/results/${sheet.id}/master-sheet`} className="rounded border px-4 py-2">
          Master Sheet View
        </Link>
        <Link href={`/admin/results/${sheet.id}/summary-sheet`} className="rounded border px-4 py-2">
          Summary Sheet View
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Matric No</th>
              <th className="px-4 py-3 text-left">Grade</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">CA</th>
              <th className="px-4 py-3 text-left">Exam</th>
            </tr>
          </thead>
          <tbody>
            {sheet.entries.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="px-4 py-3">{entry.studentProfile.matricNumber}</td>
                <td className="px-4 py-3">{entry.letterGrade ?? "-"}</td>
                <td className="px-4 py-3">{entry.totalScore ?? "-"}</td>
                <td className="px-4 py-3">{entry.caScore ?? "-"}</td>
                <td className="px-4 py-3">{entry.examScore ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReviewResultSheetForm resultSheetId={sheet.id} status={sheet.status} />
    </div>
  );
}