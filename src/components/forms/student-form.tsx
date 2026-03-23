import { createStudentAction } from "@/modules/users/actions/create-student";

type Option = { id: string; name: string };

export function StudentForm({
  faculties,
  departments,
  programmes,
  levels,
}: {
  faculties: Option[];
  departments: Option[];
  programmes: Option[];
  levels: Option[];
}) {
  return (
    <form action={createStudentAction} className="space-y-4 rounded-2xl border bg-white p-6">
      <input
        name="firstName"
        required
        placeholder="First Name"
        className="w-full rounded-xl border px-4 py-3"
      />
      <input
        name="lastName"
        required
        placeholder="Last Name"
        className="w-full rounded-xl border px-4 py-3"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full rounded-xl border px-4 py-3"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Temporary Password"
        className="w-full rounded-xl border px-4 py-3"
      />
      <input
        name="matricNumber"
        required
        placeholder="Matric Number"
        className="w-full rounded-xl border px-4 py-3"
      />
      <input
        name="admissionYear"
        type="number"
        placeholder="Admission Year"
        className="w-full rounded-xl border px-4 py-3"
      />

      <select name="facultyId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select faculty</option>
        {faculties.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select name="departmentId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select department</option>
        {departments.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select name="programmeId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select programme</option>
        {programmes.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select name="levelId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select level</option>
        {levels.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        Create Student
      </button>
    </form>
  );
}