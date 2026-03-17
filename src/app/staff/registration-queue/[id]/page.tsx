import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { getRegistrationById } from "@/modules/registration/services/get-registration-by-id";
import { ReviewRegistrationForm } from "@/components/forms/review-registration-form";

export default async function StaffReviewRegistrationPage({
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Review Registration</h1>
          <p className="mt-2 text-gray-600">
            Status: {registration.status}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p><strong>Student:</strong> {registration.studentProfile.user.firstName} {registration.studentProfile.user.lastName}</p>
          <p><strong>Programme:</strong> {registration.enrollment.programme.name}</p>
          <p><strong>Level:</strong> {registration.enrollment.level.name}</p>
          <p><strong>Session:</strong> {registration.session.name}</p>
          <p><strong>Semester:</strong> {registration.semester.name}</p>
          <p><strong>Total Credits:</strong> {registration.totalCredits}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Course Code</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Credits</th>
                <th className="px-4 py-3 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {registration.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.course.courseCode}</td>
                  <td className="px-4 py-3">{item.course.title}</td>
                  <td className="px-4 py-3">{item.creditUnits}</td>
                  <td className="px-4 py-3">{item.itemType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {registration.status === "SUBMITTED" ? (
          <ReviewRegistrationForm registrationId={registration.id} />
        ) : null}
      </main>
    </div>
  );
}