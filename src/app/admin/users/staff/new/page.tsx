import { prisma } from "@/lib/db/prisma";
import { StaffForm } from "@/components/forms/staff-form";

export default async function NewStaffPage() {
  const [faculties, departments] = await Promise.all([
    prisma.faculty.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.department.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Staff</h1>
      <StaffForm faculties={faculties} departments={departments} />
    </div>
  );
}