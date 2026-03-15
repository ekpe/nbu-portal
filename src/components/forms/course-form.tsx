import { createCourseAction } from "@/modules/courses/actions/create-course";
import { updateCourseAction } from "@/modules/courses/actions/update-course";

type Option = { id: string; name: string };

type CourseFormProps = {
  faculties: Option[];
  departments: Option[];
  programmes: Option[];
  levels: Option[];
  course?: {
    id: string;
    courseCode: string;
    title: string;
    description: string | null;
    creditUnits: number;
    facultyId: string;
    departmentId: string;
    programmeId: string | null;
    levelId: string | null;
    category: string;
    isCarryoverEligible: boolean;
    isElective: boolean;
    isActive: boolean;
  };
};

export function CourseForm({
  faculties,
  departments,
  programmes,
  levels,
  course,
}: CourseFormProps) {
  const action = course ? updateCourseAction : createCourseAction;

  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      {course ? <input type="hidden" name="id" value={course.id} /> : null}

      <input name="courseCode" defaultValue={course?.courseCode ?? ""} required className="w-full rounded-xl border px-4 py-3" placeholder="Course Code" />
      <input name="title" defaultValue={course?.title ?? ""} required className="w-full rounded-xl border px-4 py-3" placeholder="Course Title" />
      <textarea name="description" defaultValue={course?.description ?? ""} className="w-full rounded-xl border px-4 py-3" rows={4} placeholder="Description" />
      <input name="creditUnits" type="number" defaultValue={course?.creditUnits ?? ""} required className="w-full rounded-xl border px-4 py-3" placeholder="Credit Units" />

      <select name="facultyId" defaultValue={course?.facultyId ?? ""} required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select faculty</option>
        {faculties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="departmentId" defaultValue={course?.departmentId ?? ""} required className="w-full rounded-xl border px-4 py-3">
        <option value="">Select department</option>
        {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="programmeId" defaultValue={course?.programmeId ?? ""} className="w-full rounded-xl border px-4 py-3">
        <option value="">Select programme</option>
        {programmes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <select name="levelId" defaultValue={course?.levelId ?? ""} className="w-full rounded-xl border px-4 py-3">
        <option value="">Select level</option>
        {levels.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <input name="category" defaultValue={course?.category ?? "CORE"} className="w-full rounded-xl border px-4 py-3" placeholder="Category" />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="isCarryoverEligible" defaultChecked={course?.isCarryoverEligible ?? true} />
        Carryover Eligible
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="isElective" defaultChecked={course?.isElective ?? false} />
        Elective
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="isActive" defaultChecked={course?.isActive ?? true} />
        Active
      </label>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        {course ? "Update Course" : "Create Course"}
      </button>
    </form>
  );
}