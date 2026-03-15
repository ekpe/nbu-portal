import { createFacultyAction } from "@/modules/academics/actions/create-faculty";
import { updateFacultyAction } from "@/modules/academics/actions/update-faculty";

type FacultyFormProps = {
  faculty?: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    isActive: boolean;
  };
};

export function FacultyForm({ faculty }: FacultyFormProps) {
  const action = faculty ? updateFacultyAction : createFacultyAction;

  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      {faculty ? <input type="hidden" name="id" value={faculty.id} /> : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Code</label>
        <input
          name="code"
          defaultValue={faculty?.code ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          name="name"
          defaultValue={faculty?.name ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={faculty?.description ?? ""}
          className="w-full rounded-xl border px-4 py-3"
          rows={4}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={faculty?.isActive ?? true}
        />
        Active
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        {faculty ? "Update Faculty" : "Create Faculty"}
      </button>
    </form>
  );
}