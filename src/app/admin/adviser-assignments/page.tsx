import { listAdviserAssignments } from "@/modules/assignments/services/list-adviser-assignments";
import { archiveAdviserAssignmentAction } from "@/modules/assignments/actions/archive-adviser-assignment";
import { restoreAdviserAssignmentAction } from "@/modules/assignments/actions/restore-adviser-assignment";
import Link from "next/link";

export default async function AdviserAssignmentsPage() {
  const assignments = await listAdviserAssignments();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Adviser Assignments</h1>
        <Link href="/admin/adviser-assignments/new" className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white">
          New Adviser Assignment
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Staff</th>
              <th className="px-4 py-3 text-left">Faculty</th>
              <th className="px-4 py-3 text-left">Programme</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Session</th>
              <th className="px-4 py-3 text-left">Semester</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-t">
                <td className="px-4 py-3">
                  {assignment.staffProfile.user.firstName} {assignment.staffProfile.user.lastName}
                </td>
                <td className="px-4 py-3">{assignment.faculty.name}</td>
                <td className="px-4 py-3">{assignment.programme?.name ?? "-"}</td>
                <td className="px-4 py-3">{assignment.level?.name ?? "-"}</td>
                <td className="px-4 py-3">{assignment.session.name}</td>
                <td className="px-4 py-3">{assignment.semester.name}</td>
                <td className="px-4 py-3">{assignment.isActive ? "Active" : "Archived"}</td>
                <td className="px-4 py-3">
                  {assignment.isActive ? (
                    <form action={archiveAdviserAssignmentAction}>
                      <input type="hidden" name="id" value={assignment.id} />
                      <button className="text-red-600 hover:underline">Archive</button>
                    </form>
                  ) : (
                    <form action={restoreAdviserAssignmentAction}>
                      <input type="hidden" name="id" value={assignment.id} />
                      <button className="text-green-600 hover:underline">Restore</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}