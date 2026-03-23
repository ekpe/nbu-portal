import { listBursaryOverrideQueue } from "@/modules/finance/services/list-bursary-override-queue";
import { approveFinanceOverrideAction } from "@/modules/finance/actions/approve-finance-override";

export default async function FinanceOverrideQueuePage() {
  const requests = await listBursaryOverrideQueue();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Finance Override Queue</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Programme</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Request Type</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Balance</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="px-4 py-3">
                  {request.studentProfile.user.firstName} {request.studentProfile.user.lastName}
                </td>
                <td className="px-4 py-3">{request.studentProfile.programme?.name ?? "-"}</td>
                <td className="px-4 py-3">{request.studentProfile.level?.name ?? "-"}</td>
                <td className="px-4 py-3">{request.requestType}</td>
                <td className="px-4 py-3">{request.reason}</td>
                <td className="px-4 py-3">{request.financeAccount.outstandingBalance}</td>
                <td className="px-4 py-3">
                  <form action={approveFinanceOverrideAction}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <button className="text-blue-600 hover:underline">Approve</button>
                  </form>
                </td>
              </tr>
            ))}
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No pending finance override requests.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}