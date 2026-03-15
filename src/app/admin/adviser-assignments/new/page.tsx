import { prisma } from "@/lib/db/prisma";
import { AdviserAssignmentForm } from "@/components/forms/adviser-assignment-form";

export default async function NewAdviserAssignmentPage() {
  const [staff, faculties, departments, programmes, levels, sessions, semesters] = await Promise.all([
    prisma.staffProfile.findMany({
      where: { employmentStatus: "ACTIVE" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.faculty.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.department.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.programme.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.level.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { numericValue: "asc" } }),
    prisma.academicSession.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "desc" } }),
    prisma.semester.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Adviser Assignment</h1>
      <AdviserAssignmentForm
        staff={staff.map((s) => ({
          id: s.id,
          label: `${s.user.firstName} ${s.user.lastName} (${s.staffNumber})`,
        }))}
        faculties={faculties}
        departments={departments}
        programmes={programmes}
        levels={levels}
        sessions={sessions}
        semesters={semesters}
      />
    </div>
  );
}