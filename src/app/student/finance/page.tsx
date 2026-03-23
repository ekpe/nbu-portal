import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { prisma } from "@/lib/db/prisma";
import { getStudentFinanceAccount } from "@/modules/finance/services/get-student-finance-account";
import { getStudentReceiptLedger } from "@/modules/finance/services/get-student-receipt-ledger";
import { requestFinanceOverrideAction } from "@/modules/finance/actions/request-finance-override";

export default async function StudentFinancePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!studentProfile) redirect("/student/dashboard");

  const [finance, receipts] = await Promise.all([
    getStudentFinanceAccount(studentProfile.id),
    getStudentReceiptLedger(studentProfile.id),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="space-y-6 p-6">
        <h1 className="text-2xl font-semibold">My Finance</h1>

        <div className="rounded-2xl border bg-white p-6">
          <p><strong>Total Due:</strong> {finance?.totalAmountDue ?? 0}</p>
          <p><strong>Total Paid:</strong> {finance?.totalAmountPaid ?? 0}</p>
          <p><strong>Outstanding Balance:</strong> {finance?.outstandingBalance ?? 0}</p>
          <p><strong>Financially Cleared:</strong> {finance?.isFinanciallyCleared ? "Yes" : "No"}</p>
        </div>

        <form action={requestFinanceOverrideAction} className="rounded-2xl border bg-white p-6 space-y-3">
          <input type="hidden" name="studentProfileId" value={studentProfile.id} />

          <input
            name="requestType"
            required
            placeholder="Request Type (e.g. Installment, Waiver)"
            className="w-full rounded-xl border px-4 py-3"
          />

          <textarea
            name="reason"
            required
            placeholder="Explain your reason clearly..."
            className="w-full rounded-xl border px-4 py-3"
            rows={4}
          />

          <button className="rounded-xl bg-gray-900 px-4 py-3 text-white">
            Request Finance Override
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Receipt No</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="border-t">
                  <td className="px-4 py-3">{receipt.receiptNumber}</td>
                  <td className="px-4 py-3">{new Date(receipt.receiptDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{receipt.amount}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/student/finance/receipts/${receipt.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {receipt.receiptNumber}
                    </a>
                  </td>
                </tr>
              ))}
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No receipts found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}