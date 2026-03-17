import { notFound } from "next/navigation";
import { getResultSheetById } from "@/modules/results/services/get-result-sheet-by-id";

export default async function MasterSheetPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sheet = await getResultSheetById(id);

  if (!sheet) notFound();

  return (
    <main className="p-6 text-sm">
      <div className="text-center">
        <h1 className="font-bold">NIGERIAN BRITISH UNIVERSITY ASA, ABIA STATE</h1>
        <h2 className="font-bold">FACULTY OF COMPUTING & INFORMATION TECHNOLOGY</h2>
        <h3 className="mt-2 font-bold">
          {sheet.offering.session.name} {sheet.offering.semester.name.toUpperCase()} EXAMINATION MASTER MARK SHEET
        </h3>
      </div>

      <div className="mt-4">
        <p>
          <strong>PROGRAMME:</strong> {sheet.offering.programme?.name ?? sheet.offering.faculty.name}
          {"  "} <strong>COURSE TITLE:</strong> {sheet.offering.course.title}
          {"  "} <strong>COURSE CODE:</strong> {sheet.offering.course.courseCode}
        </p>
        <p>
          <strong>CREDIT UNIT:</strong> {sheet.offering.course.creditUnits}
          {"  "} <strong>NUMBER OF STUDENTS:</strong> {sheet.numberOfStudents}
        </p>
      </div>

      <table className="mt-4 min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">SN</th>
            <th className="border p-2">Matriculation Number</th>
            <th className="border p-2">Letter Grade</th>
            <th className="border p-2">Total Score</th>
            <th className="border p-2">CA 30%</th>
            <th className="border p-2">Exam 70%</th>
            <th className="border p-2">Q1</th>
            <th className="border p-2">Q2</th>
            <th className="border p-2">Q3</th>
            <th className="border p-2">Q4</th>
            <th className="border p-2">Q5</th>
            <th className="border p-2">Q6</th>
            <th className="border p-2">Q7</th>
          </tr>
        </thead>
        <tbody>
          {sheet.entries.map((entry, index) => (
            <tr key={entry.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{entry.studentProfile.matricNumber}</td>
              <td className="border p-2">{entry.letterGrade ?? "-"}</td>
              <td className="border p-2">{entry.totalScore ?? "-"}</td>
              <td className="border p-2">{entry.caScore ?? "-"}</td>
              <td className="border p-2">{entry.examScore ?? "-"}</td>
              <td className="border p-2">{entry.q1Score ?? "-"}</td>
              <td className="border p-2">{entry.q2Score ?? "-"}</td>
              <td className="border p-2">{entry.q3Score ?? "-"}</td>
              <td className="border p-2">{entry.q4Score ?? "-"}</td>
              <td className="border p-2">{entry.q5Score ?? "-"}</td>
              <td className="border p-2">{entry.q6Score ?? "-"}</td>
              <td className="border p-2">{entry.q7Score ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}