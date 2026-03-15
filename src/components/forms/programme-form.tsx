import { createProgrammeAction } from "@/modules/academics/actions/create-programme";
import { updateProgrammeAction } from "@/modules/academics/actions/update-programme";

type FacultyOption = {
  id: string;
  name: string;
};

type DepartmentOption = {
  id: string;
  name: string;
};

type ProgrammeFormProps = {
  faculties: FacultyOption[];
  departments: DepartmentOption[];
  programme?: {
    id: string;
    facultyId: string;
    departmentId: string;
    code: string;
    name: string;
    awardType: string | null;
    durationYears: number | null;
    isActive: boolean;
  };
};

export function ProgrammeForm({
  faculties,
  departments,
  programme,
}: ProgrammeFormProps) {
  const action = programme ? updateProgrammeAction : createProgrammeAction;

  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      {programme ? <input type="hidden" name="id" value={programme.id} /> : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Faculty</label>
        <select
          name="facultyId"
          defaultValue={programme?.facultyId ?? ""}
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
        <label className="mb-1 block text-sm font-medium">Department</label>
        <select
          name="departmentId"
          defaultValue={programme?.departmentId ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        >
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Code</label>
        <input
          name="code"
          defaultValue={programme?.code ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          name="name"
          defaultValue={programme?.name ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Award Type</label>
        <input
          name="awardType"
          defaultValue={programme?.awardType ?? ""}
          className="w-full rounded-xl border px-4 py-3"
          placeholder="e.g. BSc"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Duration (Years)</label>
        <input
          name="durationYears"
          type="number"
          defaultValue={programme?.durationYears ?? ""}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={programme?.isActive ?? true}
        />
        Active
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        {programme ? "Update Programme" : "Create Programme"}
      </button>
    </form>
  );
}