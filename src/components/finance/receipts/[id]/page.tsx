import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ReceiptPrintToolbar } from "@/components/finance/receipt-print-toolbar";

export default async function StudentReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const receipt = await prisma.receiptLedgerEntry.findUnique({
    where: { id },
    include: {
      studentProfile: {
        include: {
          user: true,
          programme: true,
          level: true,
        },
      },
      paymentTransaction: true,
      session: true,
      semester: true,
    },
  });

  if (!receipt) notFound();
  if (receipt.studentProfile.userId !== session.user.id) redirect("/student/finance");

  return (
    <main className="mx-auto max-w-3xl bg-white p-8 text-sm">
      <ReceiptPrintToolbar />

      <div className="text-center">
        <h1 className="font-bold">NIGERIAN BRITISH UNIVERSITY</h1>
        <h2 className="font-bold">OFFICIAL PAYMENT RECEIPT</h2>
      </div>

      <div className="mt-6 space-y-2">
        <p><strong>Receipt No:</strong> {receipt.receiptNumber}</p>
        <p><strong>Date:</strong> {new Date(receipt.receiptDate).toLocaleString()}</p>
        <p>
          <strong>Student:</strong> {receipt.studentProfile.user.firstName}{" "}
          {receipt.studentProfile.user.lastName}
        </p>
        <p><strong>Matric Number:</strong> {receipt.studentProfile.matricNumber}</p>
        <p><strong>Programme:</strong> {receipt.studentProfile.programme?.name ?? "-"}</p>
        <p><strong>Level:</strong> {receipt.studentProfile.level?.name ?? "-"}</p>
        <p><strong>Session:</strong> {receipt.session?.name ?? "-"}</p>
        <p><strong>Semester:</strong> {receipt.semester?.name ?? "-"}</p>
        <p><strong>Amount:</strong> {receipt.amount}</p>
        <p><strong>Description:</strong> {receipt.description}</p>
        <p><strong>Reference:</strong> {receipt.paymentTransaction?.reference ?? "-"}</p>
      </div>
    </main>
  );
}