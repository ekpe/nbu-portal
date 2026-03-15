import { createSessionAction } from "@/modules/academics/actions/create-session";
import { updateSessionAction } from "@/modules/academics/actions/update-session";

type SessionFormProps = {
  session?: {
    id: string;
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

export function SessionForm({ session }: SessionFormProps) {
  const action = session ? updateSessionAction : createSessionAction;

  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      {session ? <input type="hidden" name="id" value={session.id} /> : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Session Name</label>
        <input
          name="name"
          defaultValue={session?.name ?? ""}
          required
          className="w-full rounded-xl border px-4 py-3"
          placeholder="e.g. 2025/2026"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Start Date</label>
        <input
          name="startDate"
          type="date"
          defaultValue={formatDateInput(session?.startDate)}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">End Date</label>
        <input
          name="endDate"
          type="date"
          defaultValue={formatDateInput(session?.endDate)}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={session?.isActive ?? true}
        />
        Active
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isCurrent"
          defaultChecked={session?.isCurrent ?? false}
        />
        Current Session
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        {session ? "Update Session" : "Create Session"}
      </button>
    </form>
  );
}