import { prisma } from "@/lib/db/prisma";
import { ProgrammeForm } from "@/components/forms/programme-form";

export default async function NewProgrammePage() {
  const [faculties, departments] = await Promise.all([
    prisma.faculty.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.department.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Programme</h1>
      <ProgrammeForm faculties={faculties} departments={departments} />
    </div>
  );
}