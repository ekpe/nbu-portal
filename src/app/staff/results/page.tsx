import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { listLecturerCourseOfferings } from "@/modules/results/services/list-lecturer-course-offerings";
import { createOrOpenResultSheetAction } from "@/modules/results/actions/create-or-open-result-sheet";

export default async function StaffResultsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const assignments = await listLecturerCourseOfferings(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="p-6">
        <h1 className="text-2xl font-semibold">My Result Sheets</h1>

        <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Session</th>
                <th className="px-4 py-3 text-left">Semester</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="border-t">
                  <td className="px-4 py-3">
                    {assignment.offering.course.courseCode} - {assignment.offering.course.title}
                  </td>
                  <td className="px-4 py-3">{assignment.offering.session.name}</td>
                  <td className="px-4 py-3">{assignment.offering.semester.name}</td>
                  <td className="px-4 py-3">{assignment.offering.department.name}</td>
                  <td className="px-4 py-3">
                    <form action={createOrOpenResultSheetAction}>
                      <input type="hidden" name="courseOfferingId" value={assignment.offering.id} />
                      <button className="text-blue-600 hover:underline">
                        Open Result Sheet
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No course assignments found.
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