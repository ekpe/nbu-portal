import Link from "next/link";
import { listFaculties } from "@/modules/academics/services/list-faculties";
import { archiveFacultyAction } from "@/modules/academics/actions/archive-faculty";
import { restoreFacultyAction } from "@/modules/academics/actions/restore-faculty";

export default async function FacultiesPage() {
  const faculties = await listFaculties();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Faculties</h1>
        <Link
          href="/admin/academics/faculties/new"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white"
        >
          New Faculty
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty) => (
              <tr key={faculty.id} className="border-t">
                <td className="px-4 py-3">{faculty.code}</td>
                <td className="px-4 py-3">{faculty.name}</td>
                <td className="px-4 py-3">{faculty.isActive ? "Active" : "Archived"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/academics/faculties/${faculty.id}/edit`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    {faculty.isActive ? (
                      <form action={archiveFacultyAction}>
                        <input type="hidden" name="id" value={faculty.id} />
                        <button type="submit" className="text-sm text-red-600 hover:underline">
                          Archive
                        </button>
                      </form>
                    ) : (
                      <form action={restoreFacultyAction}>
                        <input type="hidden" name="id" value={faculty.id} />
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