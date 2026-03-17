import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { getRegistrationById } from "@/modules/registration/services/get-registration-by-id";
import { removeCourseFromRegistrationAction } from "@/modules/registration/actions/remove-course-from-registration";
import { submitRegistrationAction } from "@/modules/registration/actions/submit-registration";
import { listAvailableCourseOffingsForStudentAlias } from "@/modules/registration/services/list-helpers";
import { AddCourseToRegistrationForm } from "@/components/forms/add-course-to-registration-form";

export default async function StudentRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const registration = await getRegistrationById(id);

  if (!registration) notFound();
  if (registration.studentProfile.userId !== session.user.id) redirect("/student/registration");

  const offerings =
    registration.status === "DRAFT"
      ? await listAvailableCourseOffingsForStudentAlias(
          registration.enrollment.facultyId,
          registration.enrollment.departmentId,
          registration.enrollment.programmeId,
          registration.enrollment.levelId,
          registration.sessionId,
          registration.semesterId,
        )
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Registration Detail</h1>
          <p className="mt-2 text-gray-600">
            {registration.session.name} | {registration.semester.name} | Status: {registration.status}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p><strong>Student:</strong> {registration.studentProfile.user.firstName} {registration.studentProfile.user.lastName}</p>
          <p><strong>Programme:</strong> {registration.enrollment.programme.name}</p>
          <p><strong>Level:</strong> {registration.enrollment.level.name}</p>
          <p><strong>Total Credits:</strong> {registration.totalCredits}</p>
        </div>

        {registration.status === "DRAFT" ? (
          <AddCourseToRegistrationForm registrationId={registration.id} offerings={offerings} />
        ) : null}

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Course Code</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Credits</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {registration.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.course.courseCode}</td>
                  <td className="px-4 py-3">{item.course.title}</td>
                  <td className="px-4 py-3">{item.creditUnits}</td>
                  <td className="px-4 py-3">{item.itemType}</td>
                  <td className="px-4 py-3">
                    {registration.status === "DRAFT" ? (
                      <form action={removeCourseFromRegistrationAction}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <button className="text-red-600 hover:underline">Remove</button>
                      </form>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
              {registration.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No courses added yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {registration.status === "DRAFT" ? (
          <form action={submitRegistrationAction}>
            <input type="hidden" name="registrationId" value={registration.id} />
            <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
              Submit Registration
            </button>
          </form>
        ) : null}
      </main>
    </div>
  );
}