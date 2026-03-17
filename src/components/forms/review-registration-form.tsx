import { approveRegistrationAction } from "@/modules/registration/actions/approve-registration";
import { rejectRegistrationAction } from "@/modules/registration/actions/reject-registration";

export function ReviewRegistrationForm({
  registrationId,
}: {
  registrationId: string;
}) {
  return (
    <div className="space-y-4 rounded-2xl border bg-white p-6">
      <form action={approveRegistrationAction} className="space-y-3">
        <input type="hidden" name="registrationId" value={registrationId} />
        <textarea
          name="comment"
          placeholder="Optional approval comment"
          className="w-full rounded-xl border px-4 py-3"
          rows={3}
        />
        <button className="rounded-xl bg-green-700 px-4 py-3 text-white">
          Approve Registration
        </button>
      </form>

      <form action={rejectRegistrationAction} className="space-y-3">
        <input type="hidden" name="registrationId" value={registrationId} />
        <textarea
          name="comment"
          placeholder="Required rejection comment"
          required
          className="w-full rounded-xl border px-4 py-3"
          rows={3}
        />
        <button className="rounded-xl bg-red-700 px-4 py-3 text-white">
          Reject Registration
        </button>
      </form>
    </div>
  );
}