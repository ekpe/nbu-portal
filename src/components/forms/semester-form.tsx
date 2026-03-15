import { createSemesterAction } from "@/modules/academics/actions/create-semester";
import { updateSemesterAction } from "@/modules/academics/actions/update-semester";

type SemesterFormProps = {
  semester?: {
    id: string;
    code: string;
    name: string;
    startDate: Date | null;
    endDate: Date | null;
    isActive: boolean;
    isCurrent: boolean;
  };
};

function formatDateInput(value: Date | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
}

export function SemesterForm({ semester }: SemesterFormProps) {
  const action = semester ? updateSemesterAction : createSemesterAction;

  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      {semester ? <input type="hidden" name="id" value={semester.id} /> : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Code</label>
        <input
          name="code"
          defaultValue={semester?.code ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
          placeholder="e.g. FIRST"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          name="name"
          defaultValue={semester?.name ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
          placeholder="e.g. First Semester"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Start Date</label>
        <input
          name="startDate"
          type="date"
          defaultValue={formatDateInput(semester?.startDate)}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">End Date</label>
        <input
          name="endDate"
          type="date"
          defaultValue={formatDateInput(semester?.endDate)}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={semester?.isActive ?? true}
        />
        Active
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isCurrent"
          defaultChecked={semester?.isCurrent ?? false}
        />
        Current Semester
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        {semester ? "Update Semester" : "Create Semester"}
      </button>
    </form>
  );
}