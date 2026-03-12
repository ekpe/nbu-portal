import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isStaff = (session.user.roles ?? []).some((role) =>
    ["DEAN", "HOD", "COURSE_ADVISER", "LECTURER"].includes(role),
  );

  if (!isStaff) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
}