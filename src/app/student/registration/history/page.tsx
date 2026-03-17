import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { prisma } from "@/lib/db/prisma";
import { getStudentRegistrationHistory } from "@/modules/registration/services/get-student-registration-history";

export default async function StudentRegistrationHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!studentProfile) {
    redirect("/student/dashboard");
  }

  const registrations = await getStudentRegistrationHistory(studentProfile.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Registration History</h1>

        <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Session</th>
                <th className="px-4 py-3 text-left">Semester</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Courses</th>
                <th className="px-4 py-3 text-left">Credits</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id} className="border-t">
                  <td className="px-4 py-3">{registration.session.name}</td>
                  <td className="px-4 py-3">{registration.semester.name}</td>
                  <td className="px-4 py-3">{registration.status}</td>
                  <td className="px-4 py-3">{registration.items.length}</td>
                  <td className="px-4 py-3">{registration.totalCredits}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/student/registration/${registration.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No registrations found.
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