import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { DepartmentForm } from "@/components/forms/department-form";

export default async function EditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [department, faculties] = await Promise.all([
    prisma.department.findUnique({
      where: { id },
    }),
    prisma.faculty.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!department) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Department</h1>
      <DepartmentForm faculties={faculties} department={department} />
    </div>
  );
}