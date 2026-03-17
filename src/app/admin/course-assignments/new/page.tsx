import { prisma } from "@/lib/db/prisma";
import { CourseAssignmentForm } from "@/components/forms/course-assignment-form";

export default async function NewCourseAssignmentPage() {
  const [offerings, lecturers] = await Promise.all([
    prisma.courseOffering.findMany({
      where: { isActive: true },
      include: { course: true, session: true, semester: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.staffProfile.findMany({
      where: { employmentStatus: "ACTIVE" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Assign Lecturer to Course</h1>
      <CourseAssignmentForm
        offerings={offerings.map((o) => ({
          id: o.id,
          label: `${o.course.courseCode} - ${o.course.title} (${o.session.name} / ${o.semester.name})`,
        }))}
        lecturers={lecturers.map((l) => ({
          id: l.id,
          label: `${l.user.firstName} ${l.user.lastName} (${l.staffNumber})`,
        }))}
      />
    </div>
  );
}