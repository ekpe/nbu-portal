import { prisma } from "@/lib/db/prisma";
import { CourseForm } from "@/components/forms/course-form";

export default async function NewCoursePage() {
  const [faculties, departments, programmes, levels] = await Promise.all([
    prisma.faculty.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.department.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.programme.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.level.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { numericValue: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Course</h1>
      <CourseForm faculties={faculties} departments={departments} programmes={programmes} levels={levels} />
    </div>
  );
}