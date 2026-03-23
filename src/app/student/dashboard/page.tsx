import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome, {session.user.name}. This is the student shell.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/student/profile"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">My Profile</h2>
            <p className="mt-2 text-sm text-gray-600">
              View your student profile.
            </p>
          </Link>

          <Link
            href="/student/registration"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">Course Registration</h2>
            <p className="mt-2 text-sm text-gray-600">
              Start or continue your registration.
            </p>
          </Link>

          <Link
            href="/student/registration/history"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">Registration History</h2>
            <p className="mt-2 text-sm text-gray-600">
              View your past registrations.
            </p>
          </Link>

          <Link
            href="/student/results"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">My Results</h2>
            <p className="mt-2 text-sm text-gray-600">
              View your published semester results and GPA.
            </p>
          </Link>

          <Link
            href="/student/transcript"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">Transcript Ledger</h2>
            <p className="mt-2 text-sm text-gray-600">
              View your cumulative academic ledger.
            </p>
          </Link>

          <Link
            href="/student/finance"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">My Finance</h2>
            <p className="mt-2 text-sm text-gray-600">
              View fees, receipts, and finance clearance.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}