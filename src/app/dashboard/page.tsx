import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDefaultDashboardByRoles } from "@/lib/auth/role-redirect";

export default async function DashboardRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const destination = getDefaultDashboardByRoles(session.user.roles ?? []);
  redirect(destination);
}