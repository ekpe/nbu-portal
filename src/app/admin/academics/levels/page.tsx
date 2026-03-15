import Link from "next/link";
import { listLevels } from "@/modules/academics/services/list-levels";
import { archiveLevelAction } from "@/modules/academics/actions/archive-level";
import { restoreLevelAction } from "@/modules/academics/actions/restore-level";

export default async function LevelsPage() {
  const levels = await listLevels();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Levels</h1>
        <Link
          href="/admin/academics/levels/new"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white"
        >
          New Level
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Numeric Value</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <tr key={level.id} className="border-t">
                <td className="px-4 py-3">{level.code}</td>
                <td className="px-4 py-3">{level.name}</td>
                <td className="px-4 py-3">{level.numericValue}</td>
                <td className="px-4 py-3">{level.isActive ? "Active" : "Archived"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/academics/levels/${level.id}/edit`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    {level.isActive ? (
                      <form action={archiveLevelAction}>
                        <input type="hidden" name="id" value={level.id} />
                        <button type="submit" className="text-sm text-red-600 hover:underline">
                          Archive
                        </button>
                      </form>
                    ) : (
                      <form action={restoreLevelAction}>
                        <input type="hidden" name="id" value={level.id} />
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