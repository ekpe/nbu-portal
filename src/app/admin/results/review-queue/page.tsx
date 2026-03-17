import Link from "next/link";
import { listResultReviewQueue } from "@/modules/results/services/list-result-review-queue";

export default async function ResultReviewQueuePage() {
  const queue = await listResultReviewQueue();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Result Review Queue</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Session</th>
              <th className="px-4 py-3 text-left">Semester</th>
              <th className="px-4 py-3 text-left">Lecturer</th>
              <th className="px-4 py-3 text-left">Entries</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((sheet) => (
              <tr key={sheet.id} className="border-t">
                <td className="px-4 py-3">
                  {sheet.offering.course.courseCode} - {sheet.offering.course.title}
                </td>
                <td className="px-4 py-3">{sheet.offering.session.name}</td>
                <td className="px-4 py-3">{sheet.offering.semester.name}</td>
                <td className="px-4 py-3">
                  {sheet.lecturer.user.firstName} {sheet.lecturer.user.lastName}
                </td>
                <td className="px-4 py-3">{sheet.entries.length}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/results/${sheet.id}`} className="text-blue-600 hover:underline">
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {queue.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No submitted result sheets.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}