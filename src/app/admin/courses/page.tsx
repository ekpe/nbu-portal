import Link from "next/link";
import { listCourses } from "@/modules/courses/services/list-courses";
import { archiveCourseAction } from "@/modules/courses/actions/archive-course";
import { restoreCourseAction } from "@/modules/courses/actions/restore-course";

export default async function CoursesPage() {
  const courses = await listCourses();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <Link href="/admin/courses/new" className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white">
          New Course
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Units</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t">
                <td className="px-4 py-3">{course.courseCode}</td>
                <td className="px-4 py-3">{course.title}</td>
                <td className="px-4 py-3">{course.creditUnits}</td>
                <td className="px-4 py-3">{course.department.name}</td>
                <td className="px-4 py-3">{course.isActive ? "Active" : "Archived"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/courses/${course.id}/edit`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    {course.isActive ? (
                      <form action={archiveCourseAction}>
                        <input type="hidden" name="id" value={course.id} />
                        <button className="text-red-600 hover:underline">Archive</button>
                      </form>
                    ) : (
                      <form action={restoreCourseAction}>
                        <input type="hidden" name="id" value={course.id} />
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