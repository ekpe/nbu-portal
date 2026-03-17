import Link from "next/link";
import { listCourseAssignments } from "@/modules/assignments/services/list-course-assignments";
import { archiveCourseAssignmentAction } from "@/modules/assignments/actions/archive-course-assignment";
import { restoreCourseAssignmentAction } from "@/modules/assignments/actions/restore-course-assignment";

export default async function CourseAssignmentsPage() {
  const assignments = await listCourseAssignments();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Course Assignments</h1>
        <Link
          href="/admin/course-assignments/new"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white"
        >
          New Course Assignment
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Session</th>
              <th className="px-4 py-3 text-left">Semester</th>
              <th className="px-4 py-3 text-left">Lecturer</th>
              <th className="px-4 py-3 text-left">Primary</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
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
                <td className="px-4 py-3">
                  {assignment.lecturer.user.firstName} {assignment.lecturer.user.lastName}
                </td>
                <td className="px-4 py-3">{assignment.isPrimary ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{assignment.isActive ? "Active" : "Archived"}</td>
                <td className="px-4 py-3">
                  {assignment.isActive ? (
                    <form action={archiveCourseAssignmentAction}>
                      <input type="hidden" name="id" value={assignment.id} />
                      <button className="text-red-600 hover:underline">Archive</button>
                    </form>
                  ) : (
                    <form action={restoreCourseAssignmentAction}>
                      <input type="hidden" name="id" value={assignment.id} />
                      <button className="text-green-600 hover:underline">Restore</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}

            {assignments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No course assignments found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}