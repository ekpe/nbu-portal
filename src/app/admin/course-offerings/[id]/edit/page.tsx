import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { CourseOfferingForm } from "@/components/forms/course-offering-form";

export default async function EditCourseOfferingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [offering, courses, sessions, semesters, faculties, departments, programmes, levels] = await Promise.all([
    prisma.courseOffering.findUnique({ where: { id } }),
    prisma.course.findMany({ select: { id: true, courseCode: true, title: true }, orderBy: { courseCode: "asc" } }),
    prisma.academicSession.findMany({ select: { id: true, name: true }, orderBy: { name: "desc" } }),
    prisma.semester.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.faculty.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.department.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.programme.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.level.findMany({ select: { id: true, name: true }, orderBy: { numericValue: "asc" } }),
  ]);

  if (!offering) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Course Offering</h1>
      <CourseOfferingForm
        courses={courses.map((c) => ({ id: c.id, label: `${c.courseCode} - ${c.title}` }))}
        sessions={sessions}
        semesters={semesters}
        faculties={faculties}
        departments={departments}
        programmes={programmes}
        levels={levels}
        offering={offering}
      />
    </div>
  );
}