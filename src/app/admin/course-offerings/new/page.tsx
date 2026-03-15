import { prisma } from "@/lib/db/prisma";
import { CourseOfferingForm } from "@/components/forms/course-offering-form";

export default async function NewCourseOfferingPage() {
  const [courses, sessions, semesters, faculties, departments, programmes, levels] = await Promise.all([
    prisma.course.findMany({
      where: { isActive: true },
      select: { id: true, courseCode: true, title: true },
      orderBy: { courseCode: "asc" },
    }),
    prisma.academicSession.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "desc" } }),
    prisma.semester.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.faculty.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.department.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.programme.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.level.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { numericValue: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Create Course Offering</h1>
      <CourseOfferingForm
        courses={courses.map((c) => ({ id: c.id, label: `${c.courseCode} - ${c.title}` }))}
        sessions={sessions}
        semesters={semesters}
        faculties={faculties}
        departments={departments}
        programmes={programmes}
        levels={levels}
      />
    </div>
  );
}