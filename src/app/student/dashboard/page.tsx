import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Student Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome, {session.user.name}. This is the student shell.
      </p>
    </main>
  );
}