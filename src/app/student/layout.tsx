import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!(session.user.roles ?? []).includes("STUDENT")) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
}