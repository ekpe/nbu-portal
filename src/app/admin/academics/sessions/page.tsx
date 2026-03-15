import Link from "next/link";
import { listSessions } from "@/modules/academics/services/list-sessions";
import { archiveSessionAction } from "@/modules/academics/actions/archive-session";
import { restoreSessionAction } from "@/modules/academics/actions/restore-session";

export default async function SessionsPage() {
  const sessions = await listSessions();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Academic Sessions</h1>
        <Link
          href="/admin/academics/sessions/new"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white"
        >
          New Session
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-t">
                <td className="px-4 py-3">{session.name}</td>
                <td className="px-4 py-3">{session.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{session.isCurrent ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/academics/sessions/${session.id}/edit`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    {session.isActive ? (
                      <form action={archiveSessionAction}>
                        <input type="hidden" name="id" value={session.id} />
                        <button type="submit" className="text-sm text-red-600 hover:underline">
                          Archive
                        </button>
                      </form>
                    ) : (
                      <form action={restoreSessionAction}>
                        <input type="hidden" name="id" value={session.id} />
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