import Link from "next/link";
import { listSemesters } from "@/modules/academics/services/list-semesters";
import { archiveSemesterAction } from "@/modules/academics/actions/archive-semester";
import { restoreSemesterAction } from "@/modules/academics/actions/restore-semester";

export default async function SemestersPage() {
  const semesters = await listSemesters();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Semesters</h1>
        <Link
          href="/admin/academics/semesters/new"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white"
        >
          New Semester
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {semesters.map((semester) => (
              <tr key={semester.id} className="border-t">
                <td className="px-4 py-3">{semester.code}</td>
                <td className="px-4 py-3">{semester.name}</td>
                <td className="px-4 py-3">{semester.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{semester.isCurrent ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/academics/semesters/${semester.id}/edit`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    {semester.isActive ? (
                      <form action={archiveSemesterAction}>
                        <input type="hidden" name="id" value={semester.id} />
                        <button type="submit" className="text-sm text-red-600 hover:underline">
                          Archive
                        </button>
                      </form>
                    ) : (
                      <form action={restoreSemesterAction}>
                        <input type="hidden" name="id" value={semester.id} />
                        <button type="submit" className="text-sm text-green-600 hover:underline">
                          Restore
                        </button>
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