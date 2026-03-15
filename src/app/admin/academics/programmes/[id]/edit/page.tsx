import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ProgrammeForm } from "@/components/forms/programme-form";

export default async function EditProgrammePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [programme, faculties, departments] = await Promise.all([
    prisma.programme.findUnique({
      where: { id },
    }),
    prisma.faculty.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.department.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!programme) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Programme</h1>
      <ProgrammeForm
        faculties={faculties}
        departments={departments}
        programme={programme}
      />
    </div>
  );
}