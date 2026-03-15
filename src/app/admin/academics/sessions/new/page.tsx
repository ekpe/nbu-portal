import { SessionForm } from "@/components/forms/session-form";

export default function NewSessionPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Academic Session</h1>
      <SessionForm />
    </div>
  );
}