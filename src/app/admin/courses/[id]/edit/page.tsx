import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { CourseForm } from "@/components/forms/course-form";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [course, faculties, departments, programmes, levels] = await Promise.all([
    prisma.course.findUnique({ where: { id } }),
    prisma.faculty.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.department.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.programme.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.level.findMany({ select: { id: true, name: true }, orderBy: { numericValue: "asc" } }),
  ]);

  if (!course) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Course</h1>
      <CourseForm
        faculties={faculties}
        departments={departments}
        programmes={programmes}
        levels={levels}
        course={course}
      />
    </div>
  );
}