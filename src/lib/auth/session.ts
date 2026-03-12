import { auth } from "@/auth";

export async function getCurrentSession() {
  return auth();
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getCurrentUserRoles() {
  const session = await auth();
  return session?.user?.roles ?? [];
}