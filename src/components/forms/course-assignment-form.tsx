import { createCourseAssignmentAction } from "@/modules/assignments/actions/create-course-assignment";

type OfferingOption = { id: string; label: string };
type LecturerOption = { id: string; label: string };

export function CourseAssignmentForm({
  offerings,
  lecturers,
}: {
  offerings: OfferingOption[];
  lecturers: LecturerOption[];
}) {
  return (
    <form action={createCourseAssignmentAction} className="space-y-4 rounded-2xl border bg-white p-6">
      <select name="courseOfferingId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select course offering</option>
        {offerings.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>

      <select name="lecturerStaffProfileId" required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select lecturer</option>
        {lecturers.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="isPrimary" defaultChecked />
        Primary Lecturer
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="isActive" defaultChecked />
        Active
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        Assign Lecturer
      </button>
    </form>
  );
}