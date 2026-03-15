import { createLevelAction } from "@/modules/academics/actions/create-level";
import { updateLevelAction } from "@/modules/academics/actions/update-level";

type LevelFormProps = {
  level?: {
    id: string;
    code: string;
    name: string;
    numericValue: number;
    isActive: boolean;
  };
};

export function LevelForm({ level }: LevelFormProps) {
  const action = level ? updateLevelAction : createLevelAction;

  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      {level ? <input type="hidden" name="id" value={level.id} /> : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Code</label>
        <input
          name="code"
          defaultValue={level?.code ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          name="name"
          defaultValue={level?.name ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Numeric Value</label>
        <input
          name="numericValue"
          type="number"
          defaultValue={level?.numericValue ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={level?.isActive ?? true}
        />
        Active
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        {level ? "Update Level" : "Create Level"}
      </button>
    </form>
  );
}