import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { FacultyForm } from "@/components/forms/faculty-form";

export default async function EditFacultyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const faculty = await prisma.faculty.findUnique({
    where: { id },
  });

  if (!faculty) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Faculty</h1>
      <FacultyForm faculty={faculty} />
    </div>
  );
}