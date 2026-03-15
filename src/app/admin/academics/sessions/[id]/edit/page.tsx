import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { SessionForm } from "@/components/forms/session-form";

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await prisma.academicSession.findUnique({
    where: { id },
  });

  if (!session) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Academic Session</h1>
      <SessionForm session={session} />
    </div>
  );
}