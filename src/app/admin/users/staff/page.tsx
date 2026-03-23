import Link from "next/link";
import { listStaff } from "@/modules/users/services/list-staff";

export default async function AdminStaffPage() {
  const staff = await listStaff();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Staff</h1>
        <Link
          href="/admin/users/staff/new"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white"
        >
          New Staff
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Staff Number</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Faculty</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-t">
                <td className="px-4 py-3">
                  {member.user.firstName} {member.user.lastName}
                </td>
                <td className="px-4 py-3">{member.user.email}</td>
                <td className="px-4 py-3">{member.staffNumber}</td>
                <td className="px-4 py-3">{member.department?.name ?? "-"}</td>
                <td className="px-4 py-3">{member.faculty?.name ?? "-"}</td>
              </tr>
            ))}
            {staff.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No staff found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}