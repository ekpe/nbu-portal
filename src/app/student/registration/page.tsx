import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { getCurrentStudentRegistrationContext } from "@/modules/registration/services/get-current-student-registration-context";
import { getStudentRegistrationDraft } from "@/modules/registration/services/get-student-registration-draft";
import { createRegistrationDraftAction } from "@/modules/registration/actions/create-registration-draft";

export default async function StudentRegistrationPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const context = await getCurrentStudentRegistrationContext(session.user.id);

  if (!context?.studentProfile || !context.session || !context.semester || !context.enrollment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <main className="p-6">Student registration context is not available.</main>
      </div>
    );
  }

  const draft = await getStudentRegistrationDraft(
    context.studentProfile.id,
    context.session.id,
    context.semester.id,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Course Registration</h1>
        <p className="mt-2 text-gray-600">
          Session: {context.session.name} | Semester: {context.semester.name}
        </p>

        <div className="mt-6">
          {draft ? (
            <Link
              href={`/student/registration/${draft.id}`}
              className="rounded-xl bg-gray-900 px-4 py-3 text-white"
            >
              Continue Draft Registration
            </Link>
          ) : (
            <form action={createRegistrationDraftAction}>
              <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
                Start Registration Draft
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}