import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!(session.user.roles ?? []).includes("SUPER_ADMIN")) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
}