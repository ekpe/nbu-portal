import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getStudentFinanceAccount } from "@/modules/finance/services/get-student-finance-account";
import { placeFinanceHoldAction } from "@/modules/finance/actions/place-finance-hold";
import { releaseFinanceHoldAction } from "@/modules/finance/actions/release-finance-hold";

export default async function AdminStudentFinancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = await prisma.studentProfile.findUnique({
    where: { id },
    include: { user: true, programme: true, level: true },
  });

  if (!student) notFound();

  const finance = await getStudentFinanceAccount(student.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Student Finance</h1>
        <p className="mt-2 text-gray-600">
          {student.user.firstName} {student.user.lastName} ({student.matricNumber})
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <p><strong>Total Due:</strong> {finance?.totalAmountDue ?? 0}</p>
        <p><strong>Total Paid:</strong> {finance?.totalAmountPaid ?? 0}</p>
        <p><strong>Outstanding Balance:</strong> {finance?.outstandingBalance ?? 0}</p>
        <p><strong>Financially Cleared:</strong> {finance?.isFinanciallyCleared ? "Yes" : "No"}</p>
      </div>

      <form action={placeFinanceHoldAction} className="rounded-2xl border bg-white p-6 space-y-3">
        <input type="hidden" name="studentProfileId" value={student.id} />
        <input name="holdType" placeholder="Hold Type" className="w-full rounded-xl border px-4 py-3" />
        <textarea name="reason" placeholder="Reason" className="w-full rounded-xl border px-4 py-3" rows={3} />
        <button className="rounded-xl bg-red-700 px-4 py-3 text-white">Place Finance Hold</button>
      </form>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-medium">Active Finance Holds</h2>
        <div className="space-y-3">
          {finance?.financeHolds.map((hold) => (
            <div key={hold.id} className="flex items-center justify-between border rounded-xl p-3">
              <div>
                <p className="font-medium">{hold.holdType}</p>
                <p className="text-sm text-gray-600">{hold.reason}</p>
              </div>
              <form action={releaseFinanceHoldAction}>
                <input type="hidden" name="holdId" value={hold.id} />
                <button className="text-blue-600 hover:underline">Release</button>
              </form>
            </div>
          ))}
          {finance?.financeHolds.length === 0 ? (
            <p className="text-gray-500">No active finance holds.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}