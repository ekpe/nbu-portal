import { createAdviserAssignmentAction } from "@/modules/assignments/actions/create-adviser-assignment";

type Option = { id: string; name: string };
type StaffOption = { id: string; label: string };

export function AdviserAssignmentForm({
  staff,
  faculties,
  departments,
  programmes,
  levels,
  sessions,
  semesters,
}: {
  staff: StaffOption[];
  faculties: Option[];
  departments: Option[];
  programmes: Option[];
  levels: Option[];
  sessions: Option[];
  semesters: Option[];
}) {
  return (
    <form action={createAdviserAssignmentAction} className="space-y-4 rounded-2xl border bg-white p-6">
      <select name="staffProfileId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select staff</option>
        {staff.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>

      <select name="facultyId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select faculty</option>
        {faculties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="departmentId" className="w-full rounded-xl border px-4 py-3">
        <option value="">Select department</option>
        {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="programmeId" className="w-full rounded-xl border px-4 py-3">
        <option value="">Select programme</option>
        {programmes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="levelId" className="w-full rounded-xl border px-4 py-3">
        <option value="">Select level</option>
        {levels.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="sessionId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select session</option>
        {sessions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="semesterId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select semester</option>
        {semesters.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="isActive" defaultChecked />
        Active
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        Assign Adviser
      </button>
    </form>
  );
}