import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { getResultSheetById } from "@/modules/results/services/get-result-sheet-by-id";
import { generateResultSheetStudentsAction } from "@/modules/results/actions/generate-result-sheet-students";
import { saveResultEntryAction } from "@/modules/results/actions/save-result-entry";
import { submitResultSheetAction } from "@/modules/results/actions/submit-result-sheet";

export default async function StaffResultSheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const sheet = await getResultSheetById(id);

  if (!sheet) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Result Sheet</h1>
          <p className="mt-2 text-gray-600">
            {sheet.offering.course.courseCode} - {sheet.offering.course.title} |{" "}
            {sheet.offering.session.name} | {sheet.offering.semester.name}
          </p>
          <p className="mt-1 text-gray-600">Status: {sheet.status}</p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p>
            <strong>Course Code:</strong> {sheet.offering.course.courseCode}
          </p>
          <p>
            <strong>Course Title:</strong> {sheet.offering.course.title}
          </p>
          <p>
            <strong>Credit Unit:</strong> {sheet.offering.course.creditUnits}
          </p>
          <p>
            <strong>Number of Students:</strong> {sheet.numberOfStudents}
          </p>
        </div>

        {sheet.status === "DRAFT" ? (
          <form action={generateResultSheetStudentsAction}>
            <input type="hidden" name="resultSheetId" value={sheet.id} />
            <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
              Generate Students from Approved Registrations
            </button>
          </form>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border bg-white p-4">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Matric No</th>
                <th className="px-3 py-2 text-left">Student</th>
                <th className="px-3 py-2 text-left">CA</th>
                <th className="px-3 py-2 text-left">Exam</th>
                <th className="px-3 py-2 text-left">Total</th>
                <th className="px-3 py-2 text-left">Grade</th>
                <th className="px-3 py-2 text-left">Q1</th>
                <th className="px-3 py-2 text-left">Q2</th>
                <th className="px-3 py-2 text-left">Q3</th>
                <th className="px-3 py-2 text-left">Q4</th>
                <th className="px-3 py-2 text-left">Q5</th>
                <th className="px-3 py-2 text-left">Q6</th>
                <th className="px-3 py-2 text-left">Q7</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {sheet.entries.map((entry) => (
                <tr key={entry.id} className="border-t align-top">
                  <td className="px-3 py-2">{entry.studentProfile.matricNumber}</td>
                  <td className="px-3 py-2">
                    {entry.studentProfile.user.firstName}{" "}
                    {entry.studentProfile.user.lastName}
                  </td>

                  <td className="px-3 py-2" colSpan={12}>
                    <form action={saveResultEntryAction} className="flex flex-wrap gap-2">
                      <input type="hidden" name="entryId" value={entry.id} />

                      <input
                        name="caScore"
                        type="number"
                        step="0.5"
                        min="0"
                        max="30"
                        defaultValue={entry.caScore ?? ""}
                        className="w-20 rounded border px-2 py-1"
                        placeholder="CA"
                      />

                      <input
                        name="examScore"
                        type="number"
                        step="0.5"
                        min="0"
                        max="70"
                        defaultValue={entry.examScore ?? ""}
                        className="w-20 rounded border px-2 py-1"
                        placeholder="Exam"
                      />

                      <span className="inline-flex items-center px-2 text-sm text-gray-600">
                        Total: {entry.totalScore ?? "-"}
                      </span>

                      <span className="inline-flex items-center px-2 text-sm text-gray-600">
                        Grade: {entry.letterGrade ?? "-"}
                      </span>

                      <input
                        name="q1Score"
                        type="number"
                        step="0.5"
                        defaultValue={entry.q1Score ?? ""}
                        className="w-16 rounded border px-2 py-1"
                        placeholder="Q1"
                      />
                      <input
                        name="q2Score"
                        type="number"
                        step="0.5"
                        defaultValue={entry.q2Score ?? ""}
                        className="w-16 rounded border px-2 py-1"
                        placeholder="Q2"
                      />
                      <input
                        name="q3Score"
                        type="number"
                        step="0.5"
                        defaultValue={entry.q3Score ?? ""}
                        className="w-16 rounded border px-2 py-1"
                        placeholder="Q3"
                      />
                      <input
                        name="q4Score"
                        type="number"
                        step="0.5"
                        defaultValue={entry.q4Score ?? ""}
                        className="w-16 rounded border px-2 py-1"
                        placeholder="Q4"
                      />
                      <input
                        name="q5Score"
                        type="number"
                        step="0.5"
                        defaultValue={entry.q5Score ?? ""}
                        className="w-16 rounded border px-2 py-1"
                        placeholder="Q5"
                      />
                      <input
                        name="q6Score"
                        type="number"
                        step="0.5"
                        defaultValue={entry.q6Score ?? ""}
                        className="w-16 rounded border px-2 py-1"
                        placeholder="Q6"
                      />
                      <input
                        name="q7Score"
                        type="number"
                        step="0.5"
                        defaultValue={entry.q7Score ?? ""}
                        className="w-16 rounded border px-2 py-1"
                        placeholder="Q7"
                      />

                      {sheet.status === "DRAFT" ? (
                        <button className="rounded bg-gray-900 px-3 py-1 text-white">
                          Save
                        </button>
                      ) : null}
                    </form>
                  </td>
                </tr>
              ))}

              {sheet.entries.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-6 text-center text-gray-500">
                    No result entries yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {sheet.status === "DRAFT" ? (
          <form action={submitResultSheetAction}>
            <input type="hidden" name="resultSheetId" value={sheet.id} />
            <button className="rounded-xl bg-blue-700 px-4 py-3 text-white">
              Submit Result Sheet
            </button>
          </form>
        ) : null}
      </main>
    </div>
  );
}