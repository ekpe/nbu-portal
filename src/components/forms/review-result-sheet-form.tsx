import { approveResultSheetAction } from "@/modules/results/actions/approve-result-sheet";
import { rejectResultSheetAction } from "@/modules/results/actions/reject-result-sheet";
import { publishResultSheetAction } from "@/modules/results/actions/publish-result-sheet";

export function ReviewResultSheetForm({
  resultSheetId,
  status,
}: {
  resultSheetId: string;
  status: string;
}) {
  return (
    <div className="space-y-4 rounded-2xl border bg-white p-6">
      {status === "LECTURER_SUBMITTED" ? (
        <>
          <form action={approveResultSheetAction} className="space-y-3">
            <input type="hidden" name="resultSheetId" value={resultSheetId} />
            <textarea
              name="comment"
              placeholder="Optional approval comment"
              className="w-full rounded-xl border px-4 py-3"
              rows={3}
            />
            <button className="rounded-xl bg-green-700 px-4 py-3 text-white">
              Approve Result Sheet
            </button>
          </form>

          <form action={rejectResultSheetAction} className="space-y-3">
            <input type="hidden" name="resultSheetId" value={resultSheetId} />
            <textarea
              name="comment"
              placeholder="Required rejection comment"
              required
              className="w-full rounded-xl border px-4 py-3"
              rows={3}
            />
            <button className="rounded-xl bg-red-700 px-4 py-3 text-white">
              Reject Result Sheet
            </button>
          </form>
        </>
      ) : null}

      {status === "DEAN_APPROVED" ? (
        <form action={publishResultSheetAction}>
          <input type="hidden" name="resultSheetId" value={resultSheetId} />
          <button className="rounded-xl bg-blue-700 px-4 py-3 text-white">
            Publish Result Sheet
          </button>
        </form>
      ) : null}
    </div>
  );
}