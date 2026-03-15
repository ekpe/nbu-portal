import { getAcademicsSummary } from "@/modules/academics/services/get-academics-summary";

export default async function AdminAcademicsPage() {
  const summary = await getAcademicsSummary();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Academic Master Data</h1>
      <p className="mt-2 text-gray-600">
        Manage faculties, departments, programmes, levels, sessions, and semesters.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4">Faculties: {summary.faculties}</div>
        <div className="rounded-2xl border bg-white p-4">Departments: {summary.departments}</div>
        <div className="rounded-2xl border bg-white p-4">Programmes: {summary.programmes}</div>
        <div className="rounded-2xl border bg-white p-4">Levels: {summary.levels}</div>
        <div className="rounded-2xl border bg-white p-4">Sessions: {summary.sessions}</div>
        <div className="rounded-2xl border bg-white p-4">Semesters: {summary.semesters}</div>
      </div>
    </div>
  );
}