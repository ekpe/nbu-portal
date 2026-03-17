import { addCourseToRegistrationAction } from "@/modules/registration/actions/add-course-to-registration";

type Offering = {
  id: string;
  course: {
    courseCode: string;
    title: string;
    creditUnits: number;
  };
};

export function AddCourseToRegistrationForm({
  registrationId,
  offerings,
}: {
  registrationId: string;
  offerings: Offering[];
}) {
  return (
    <form action={addCourseToRegistrationAction} className="flex flex-col gap-3 rounded-2xl border bg-white p-4">
      <input type="hidden" name="registrationId" value={registrationId} />

      <select
        name="courseOfferingId"
        required
        className="rounded-xl border px-4 py-3"
      >
        <option value="">Select course offering</option>
        {offerings.map((offering) => (
          <option key={offering.id} value={offering.id}>
            {offering.course.courseCode} - {offering.course.title} ({offering.course.creditUnits} units)
          </option>
        ))}
      </select>

      <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
        Add Course
      </button>
    </form>
  );
}