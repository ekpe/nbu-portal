import { listPendingResultAmendments } from "@/modules/results/services/list-pending-result-amendments";
import { approveResultAmendmentAction } from "@/modules/results/actions/approve-result-amendment";

export default async function ResultAmendmentsPage() {
  const requests = await listPendingResultAmendments();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Pending Result Amendments</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Session</th>
              <th className="px-4 py-3 text-left">Semester</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="px-4 py-3">
                  {request.resultSheet.offering.course.courseCode} -{" "}
                  {request.resultSheet.offering.course.title}
                </td>
                <td className="px-4 py-3">
                  {request.resultSheet.offering.session.name}
                </td>
                <td className="px-4 py-3">
                  {request.resultSheet.offering.semester.name}
                </td>
                <td className="px-4 py-3">{request.reason}</td>
                <td className="px-4 py-3">{request.status}</td>
                <td className="px-4 py-3">
                  {request.status === "PENDING" ? (
                    <form action={approveResultAmendmentAction}>
                      <input type="hidden" name="amendmentId" value={request.id} />
                      <button className="text-blue-600 hover:underline">
                        Approve
                      </button>
                    </form>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}

            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No pending amendment requests.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}