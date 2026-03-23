import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "BURSARY", "DEAN"];

export async function requireBursaryOrAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const roles = session.user.roles ?? [];
  const allowed = roles.some((role) => ALLOWED_ROLES.includes(role));

  if (!allowed) {
    redirect("/dashboard");
  }

  return session;
}