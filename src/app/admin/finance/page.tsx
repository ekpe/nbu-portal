import Link from "next/link";
import { requireBursaryOrAdmin } from "@/lib/auth/require-bursary-or-admin";
import { getBursaryDashboardSummary } from "@/modules/finance/services/get-bursary-dashboard-summary";
import { listFinanceTransactions } from "@/modules/finance/services/list-finance-transactions";
import { verifyPaymentTransactionAction } from "@/modules/finance/actions/verify-payment-transaction";

export default async function AdminFinanceDashboardPage() {
  await requireBursaryOrAdmin();

  const [summary, transactions] = await Promise.all([
    getBursaryDashboardSummary(),
    listFinanceTransactions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Finance Dashboard</h1>
        <p className="mt-2 text-gray-600">Bursary operations overview.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Students with Accounts</p>
          <p className="mt-2 text-2xl font-semibold">{summary.totalStudentsWithAccounts}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Financially Cleared</p>
          <p className="mt-2 text-2xl font-semibold">{summary.clearedCount}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Uncleared</p>
          <p className="mt-2 text-2xl font-semibold">{summary.unclearedCount}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Pending Overrides</p>
          <p className="mt-2 text-2xl font-semibold">{summary.pendingOverrides}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Active Finance Holds</p>
          <p className="mt-2 text-2xl font-semibold">{summary.activeHolds}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Verified Payments</p>
          <p className="mt-2 text-2xl font-semibold">{summary.totalVerifiedPayments}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/admin/finance/override-queue" className="rounded-xl border px-4 py-2">
          Override Queue
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Reference</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Verification</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="px-4 py-3">{tx.reference}</td>
                <td className="px-4 py-3">
                  {tx.studentProfile.user.firstName} {tx.studentProfile.user.lastName}
                </td>
                <td className="px-4 py-3">{tx.amount}</td>
                <td className="px-4 py-3">{tx.paymentStatus}</td>
                <td className="px-4 py-3">{tx.verificationStatus}</td>
                <td className="px-4 py-3">
                  {tx.verificationStatus !== "VERIFIED" ? (
                    <form action={verifyPaymentTransactionAction}>
                      <input type="hidden" name="paymentTransactionId" value={tx.id} />
                      <button className="text-blue-600 hover:underline">Verify</button>
                    </form>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No payment transactions found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}