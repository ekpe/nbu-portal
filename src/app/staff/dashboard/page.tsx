import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";

export default async function StaffDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome, {session.user.name}. This is the staff shell.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/staff/profile"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">My Profile</h2>
            <p className="mt-2 text-sm text-gray-600">View your staff profile details.</p>
          </Link>

          <Link
            href="/staff/assignments"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">My Assignments</h2>
            <p className="mt-2 text-sm text-gray-600">View your course and adviser assignments.</p>
          </Link>

          <Link
            href="/staff/registration-queue"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">Registration Queue</h2>
            <p className="mt-2 text-sm text-gray-600">Review student registrations assigned to you.</p>
          </Link>

	  <Link
            href="/staff/results"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">My Result Sheets</h2>
            <p className="mt-2 text-sm text-gray-600">
              Open and manage your course result sheets.
            </p>
          </Link>

          <Link
            href="/staff/results"
            className="rounded-2xl border bg-white p-6 hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">Results Management</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter results, import Excel sheets, and request amendments.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}