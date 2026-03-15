import { createDepartmentAction } from "@/modules/academics/actions/create-department";
import { updateDepartmentAction } from "@/modules/academics/actions/update-department";

type FacultyOption = {
  id: string;
  name: string;
};

type DepartmentFormProps = {
  faculties: FacultyOption[];
  department?: {
    id: string;
    facultyId: string;
    code: string;
    name: string;
    description: string | null;
    isActive: boolean;
  };
};

export function DepartmentForm({ faculties, department }: DepartmentFormProps) {
  const action = department ? updateDepartmentAction : createDepartmentAction;

  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      {department ? <input type="hidden" name="id" value={department.id} /> : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Faculty</label>
        <select
          name="facultyId"
          defaultValue={department?.facultyId ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        >
          <option value="">Select faculty</option>
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Code</label>
        <input
          name="code"
          defaultValue={department?.code ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          name="name"
          defaultValue={department?.name ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={department?.description ?? ""}
          className="w-full rounded-xl border px-4 py-3"
          rows={4}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={department?.isActive ?? true}
        />
        Active
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        {department ? "Update Department" : "Create Department"}
      </button>
    </form>
  );
}