import { auth, signOut } from "@/auth";

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold">NBU Portal</h1>
        <p className="text-sm text-gray-500">
          {session?.user?.name} ({(session?.user?.roles ?? []).join(", ")})
        </p>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Sign out
        </button>
      </form>
    </header>
  );
}