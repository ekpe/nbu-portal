import Link from "next/link";
import { listProgrammes } from "@/modules/academics/services/list-programmes";
import { archiveProgrammeAction } from "@/modules/academics/actions/archive-programme";
import { restoreProgrammeAction } from "@/modules/academics/actions/restore-programme";

export default async function ProgrammesPage() {
  const programmes = await listProgrammes();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Programmes</h1>
        <Link
          href="/admin/academics/programmes/new"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white"
        >
          New Programme
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Faculty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programmes.map((programme) => (
              <tr key={programme.id} className="border-t">
                <td className="px-4 py-3">{programme.code}</td>
                <td className="px-4 py-3">{programme.name}</td>
                <td className="px-4 py-3">{programme.department.name}</td>
                <td className="px-4 py-3">{programme.faculty.name}</td>
                <td className="px-4 py-3">{programme.isActive ? "Active" : "Archived"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/academics/programmes/${programme.id}/edit`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    {programme.isActive ? (
                      <form action={archiveProgrammeAction}>
                        <input type="hidden" name="id" value={programme.id} />
                        <button type="submit" className="text-sm text-red-600 hover:underline">
                          Archive
                        </button>
                      </form>
                    ) : (
                      <form action={restoreProgrammeAction}>
                        <input type="hidden" name="id" value={programme.id} />
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