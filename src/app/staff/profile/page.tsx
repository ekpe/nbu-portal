import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { getStaffProfileByUserId } from "@/modules/users/services/get-staff-profile-by-user-id";

export default async function StaffProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getStaffProfileByUserId(session.user.id);

  if (!profile) {
    return (
      <div>
        <AppHeader />
        <main className="p-6">Staff profile not found.</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Staff Profile</h1>

        <div className="mt-6 rounded-2xl border bg-white p-6">
          <p><strong>Name:</strong> {profile.user.firstName} {profile.user.lastName}</p>
          <p><strong>Email:</strong> {profile.user.email}</p>
          <p><strong>Staff Number:</strong> {profile.staffNumber}</p>
          <p><strong>Title:</strong> {profile.title ?? "-"}</p>
          <p><strong>Qualification:</strong> {profile.qualification ?? "-"}</p>
          <p><strong>Rank:</strong> {profile.rank ?? "-"}</p>
          <p><strong>Faculty:</strong> {profile.faculty?.name ?? "-"}</p>
          <p><strong>Department:</strong> {profile.department?.name ?? "-"}</p>
          <p><strong>Employment Status:</strong> {profile.employmentStatus}</p>
        </div>
      </main>
    </div>
  );
}