import Link from "next/link";
import { listDepartments } from "@/modules/academics/services/list-departments";
import { archiveDepartmentAction } from "@/modules/academics/actions/archive-department";
import { restoreDepartmentAction } from "@/modules/academics/actions/restore-department";

export default async function DepartmentsPage() {
  const departments = await listDepartments();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Departments</h1>
        <Link
          href="/admin/academics/departments/new"
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white"
        >
          New Department
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Faculty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id} className="border-t">
                <td className="px-4 py-3">{department.code}</td>
                <td className="px-4 py-3">{department.name}</td>
                <td className="px-4 py-3">{department.faculty.name}</td>
                <td className="px-4 py-3">{department.isActive ? "Active" : "Archived"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/academics/departments/${department.id}/edit`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    {department.isActive ? (
                      <form action={archiveDepartmentAction}>
                        <input type="hidden" name="id" value={department.id} />
                        <button type="submit" className="text-sm text-red-600 hover:underline">
                          Archive
                        </button>
                      </form>
                    ) : (
                      <form action={restoreDepartmentAction}>
                        <input type="hidden" name="id" value={department.id} />
                        <button type="submit" className="text-sm text-green-600 hover:underline">
                          Restore
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}