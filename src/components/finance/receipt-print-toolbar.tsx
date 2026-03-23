"use client";

export function ReceiptPrintToolbar() {
  return (
    <div className="mb-4 print:hidden">
      <button
        onClick={() => window.print()}
        className="rounded-xl bg-gray-900 px-4 py-2 text-white"
      >
        Print / Save as PDF
      </button>
    </div>
  );
}