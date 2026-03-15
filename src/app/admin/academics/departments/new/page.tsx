import { prisma } from "@/lib/db/prisma";
import { DepartmentForm } from "@/components/forms/department-form";

export default async function NewDepartmentPage() {
  const faculties = await prisma.faculty.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Department</h1>
      <DepartmentForm faculties={faculties} />
    </div>
  );
}