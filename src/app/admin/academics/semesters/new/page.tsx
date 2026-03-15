import { SemesterForm } from "@/components/forms/semester-form";

export default function NewSemesterPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Semester</h1>
      <SemesterForm />
    </div>
  );
}