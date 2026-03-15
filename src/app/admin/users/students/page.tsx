import { listStudents } from "@/modules/users/services/list-students";

export default async function AdminStudentsPage() {
  const students = await listStudents();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Students</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Matric Number</th>
              <th className="px-4 py-3">Programme</th>
              <th className="px-4 py-3">Level</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="px-4 py-3">
                  {student.user.firstName} {student.user.lastName}
                </td>
                <td className="px-4 py-3">{student.user.email}</td>
                <td className="px-4 py-3">{student.matricNumber}</td>
                <td className="px-4 py-3">{student.programme?.name ?? "-"}</td>
                <td className="px-4 py-3">{student.level?.name ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}