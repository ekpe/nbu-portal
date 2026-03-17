import { notFound } from "next/navigation";
import { buildSummarySheet } from "@/modules/results/services/build-summary-sheet";

export default async function SummarySheetPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let summary;
  try {
    summary = await buildSummarySheet(id);
  } catch {
    notFound();
  }

  return (
    <main className="p-6 text-sm">
      <div className="text-center">
        <h1 className="font-bold">NIGERIAN BRITISH UNIVERSITY ASA, ABIA STATE</h1>
        <h2 className="font-bold">FACULTY OF COMPUTING AND INFORMATION TECHNOLOGY</h2>
        <h3 className="mt-2 font-bold">SUMMARY OF EXAMINATION RESULTS</h3>
      </div>

      <table className="mt-6 min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Course Title</th>
            <th className="border p-2">Course Code</th>
            <th className="border p-2">Credit Unit</th>
            <th className="border p-2">A</th>
            <th className="border p-2">B</th>
            <th className="border p-2">C</th>
            <th className="border p-2">D</th>
            <th className="border p-2">E</th>
            <th className="border p-2">F</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">NRS</th>
            <th className="border p-2">Course Lecturers</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">{summary.courseTitle}</td>
            <td className="border p-2">{summary.courseCode}</td>
            <td className="border p-2">{summary.creditUnit}</td>
            <td className="border p-2">{summary.counts.A}</td>
            <td className="border p-2">{summary.counts.B}</td>
            <td className="border p-2">{summary.counts.C}</td>
            <td className="border p-2">{summary.counts.D}</td>
            <td className="border p-2">{summary.counts.E}</td>
            <td className="border p-2">{summary.counts.F}</td>
            <td className="border p-2">{summary.total}</td>
            <td className="border p-2">{summary.nrs}</td>
            <td className="border p-2">{summary.courseLecturers}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}