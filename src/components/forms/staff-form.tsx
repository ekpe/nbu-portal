import { createStaffAction } from "@/modules/users/actions/create-staff";

type Option = { id: string; name: string };

export function StaffForm({
  faculties,
  departments,
}: {
  faculties: Option[];
  departments: Option[];
}) {
  return (
    <form action={createStaffAction} className="space-y-4 rounded-2xl border bg-white p-6">
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
        name="staffNumber"
        required
        placeholder="Staff Number"
        className="w-full rounded-xl border px-4 py-3"
      />
      <input
        name="title"
        placeholder="Title"
        className="w-full rounded-xl border px-4 py-3"
      />
      <input
        name="qualification"
        placeholder="Qualification"
        className="w-full rounded-xl border px-4 py-3"
      />
      <input
        name="rank"
        placeholder="Rank"
        className="w-full rounded-xl border px-4 py-3"
      />

      <select name="facultyId" className="w-full rounded-xl border px-4 py-3">
        <option value="">Select faculty</option>
        {faculties.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select name="departmentId" className="w-full rounded-xl border px-4 py-3">
        <option value="">Select department</option>
        {departments.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        Create Staff
      </button>
    </form>
  );
}