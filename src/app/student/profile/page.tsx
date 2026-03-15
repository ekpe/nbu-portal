import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { getStudentProfileByUserId } from "@/modules/users/services/get-student-profile-by-user-id";

export default async function StudentProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getStudentProfileByUserId(session.user.id);

  if (!profile) {
    return (
      <div>
        <AppHeader />
        <main className="p-6">Student profile not found.</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Student Profile</h1>

        <div className="mt-6 rounded-2xl border bg-white p-6">
          <p><strong>Name:</strong> {profile.user.firstName} {profile.user.lastName}</p>
          <p><strong>Email:</strong> {profile.user.email}</p>
          <p><strong>Matric Number:</strong> {profile.matricNumber}</p>
          <p><strong>Status:</strong> {profile.status}</p>
          <p><strong>Faculty:</strong> {profile.faculty?.name ?? "-"}</p>
          <p><strong>Department:</strong> {profile.department?.name ?? "-"}</p>
          <p><strong>Programme:</strong> {profile.programme?.name ?? "-"}</p>
          <p><strong>Level:</strong> {profile.level?.name ?? "-"}</p>
          <p><strong>Admission Year:</strong> {profile.admissionYear ?? "-"}</p>
        </div>
      </main>
    </div>
  );
}