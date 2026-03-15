import Link from "next/link";
import { listCourseOfferings } from "@/modules/courses/services/list-course-offerings";
import { archiveCourseOfferingAction } from "@/modules/courses/actions/archive-course-offering";
import { restoreCourseOfferingAction } from "@/modules/courses/actions/restore-course-offering";

export default async function CourseOfferingsPage() {
  const offerings = await listCourseOfferings();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Course Offerings</h1>
        <Link href="/admin/course-offerings/new" className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white">
          New Course Offering
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Session</th>
              <th className="px-4 py-3 text-left">Semester</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Assigned Lecturer(s)</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offerings.map((offering) => (
              <tr key={offering.id} className="border-t">
                <td className="px-4 py-3">{offering.course.courseCode} - {offering.course.title}</td>
                <td className="px-4 py-3">{offering.session.name}</td>
                <td className="px-4 py-3">{offering.semester.name}</td>
                <td className="px-4 py-3">{offering.department.name}</td>
                <td className="px-4 py-3">
                  {offering.assignments.length === 0
                    ? "-"
                    : offering.assignments.map((a) => `${a.lecturer.user.firstName} ${a.lecturer.user.lastName}`).join(", ")}
                </td>
                <td className="px-4 py-3">{offering.isActive ? "Active" : "Archived"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/course-offerings/${offering.id}/edit`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    {offering.isActive ? (
                      <form action={archiveCourseOfferingAction}>
                        <input type="hidden" name="id" value={offering.id} />
                        <button className="text-red-600 hover:underline">Archive</button>
                      </form>
                    ) : (
                      <form action={restoreCourseOfferingAction}>
                        <input type="hidden" name="id" value={offering.id} />
                        <button className="text-green-600 hover:underline">Restore</button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}