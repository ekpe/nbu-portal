import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/academics", label: "Academic Overview" },
  { href: "/admin/academics/faculties", label: "Faculties" },
  { href: "/admin/academics/departments", label: "Departments" },
  { href: "/admin/academics/programmes", label: "Programmes" },
  { href: "/admin/academics/levels", label: "Levels" },
  { href: "/admin/academics/sessions", label: "Sessions" },
  { href: "/admin/academics/semesters", label: "Semesters" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/course-offerings", label: "Course Offerings" },
  { href: "/admin/course-assignments", label: "Course Assignments" },
  { href: "/admin/adviser-assignments", label: "Adviser Assignments" },
  { href: "/admin/users/students", label: "Students" },
  { href: "/admin/users/staff", label: "Staff" },
  { href: "/admin/audit", label: "Audit Logs" },
  { href: "/admin/results/review-queue", label: "Result Review Queue" },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">Admin Menu</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}