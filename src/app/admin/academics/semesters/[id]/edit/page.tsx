import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { SemesterForm } from "@/components/forms/semester-form";

export default async function EditSemesterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const semester = await prisma.semester.findUnique({
    where: { id },
  });

  if (!semester) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Semester</h1>
      <SemesterForm semester={semester} />
    </div>
  );
}