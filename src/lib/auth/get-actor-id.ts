import { auth } from "@/auth";

export async function getActorId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}