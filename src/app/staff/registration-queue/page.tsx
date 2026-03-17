import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { getAdviserQueue } from "@/modules/registration/services/get-adviser-queue";

export default async function StaffRegistrationQueuePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const queue = await getAdviserQueue(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Registration Queue</h1>

        <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Programme</th>
                <th className="px-4 py-3 text-left">Level</th>
                <th className="px-4 py-3 text-left">Session</th>
                <th className="px-4 py-3 text-left">Semester</th>
                <th className="px-4 py-3 text-left">Courses</th>
                <th className="px-4 py-3 text-left">Credits</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((registration) => (
                <tr key={registration.id} className="border-t">
                  <td className="px-4 py-3">
                    {registration.studentProfile.user.firstName} {registration.studentProfile.user.lastName}
                  </td>
                  <td className="px-4 py-3">{registration.studentProfile.programme?.name ?? "-"}</td>
                  <td className="px-4 py-3">{registration.studentProfile.level?.name ?? "-"}</td>
                  <td className="px-4 py-3">{registration.session.name}</td>
                  <td className="px-4 py-3">{registration.semester.name}</td>
                  <td className="px-4 py-3">{registration.items.length}</td>
                  <td className="px-4 py-3">{registration.totalCredits}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/staff/registration-queue/${registration.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                    No pending registrations found.
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