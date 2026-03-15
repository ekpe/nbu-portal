import { createCourseOfferingAction } from "@/modules/courses/actions/create-course-offering";
import { updateCourseOfferingAction } from "@/modules/courses/actions/update-course-offering";

type Option = { id: string; name: string };
type CourseOption = { id: string; label: string };

type CourseOfferingFormProps = {
  courses: CourseOption[];
  sessions: Option[];
  semesters: Option[];
  faculties: Option[];
  departments: Option[];
  programmes: Option[];
  levels: Option[];
  offering?: {
    id: string;
    courseId: string;
    sessionId: string;
    semesterId: string;
    facultyId: string;
    departmentId: string;
    programmeId: string | null;
    levelId: string | null;
    registrationCap: number | null;
    isActive: boolean;
  };
};

export function CourseOfferingForm({
  courses,
  sessions,
  semesters,
  faculties,
  departments,
  programmes,
  levels,
  offering,
}: CourseOfferingFormProps) {
  const action = offering ? updateCourseOfferingAction : createCourseOfferingAction;

  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      {offering ? <input type="hidden" name="id" value={offering.id} /> : null}

      <select name="courseId" defaultValue={offering?.courseId ?? ""} required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select course</option>
        {courses.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>

      <select name="sessionId" defaultValue={offering?.sessionId ?? ""} required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select session</option>
        {sessions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="semesterId" defaultValue={offering?.semesterId ?? ""} required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select semester</option>
        {semesters.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="facultyId" defaultValue={offering?.facultyId ?? ""} required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select faculty</option>
        {faculties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="departmentId" defaultValue={offering?.departmentId ?? ""} required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select department</option>
        {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="programmeId" defaultValue={offering?.programmeId ?? ""} className="w-full rounded-xl border px-4 py-3">
        <option value="">Select programme</option>
        {programmes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="levelId" defaultValue={offering?.levelId ?? ""} className="w-full rounded-xl border px-4 py-3">
        <option value="">Select level</option>
        {levels.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <input name="registrationCap" type="number" defaultValue={offering?.registrationCap ?? ""} className="w-full rounded-xl border px-4 py-3" placeholder="Registration Cap" />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="isActive" defaultChecked={offering?.isActive ?? true} />
        Active
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        {offering ? "Update Course Offering" : "Create Course Offering"}
      </button>
    </form>
  );
}