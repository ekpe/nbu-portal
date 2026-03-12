export function getDefaultDashboardByRoles(roles: string[]) {
  if (roles.includes("SUPER_ADMIN")) return "/admin/dashboard";
  if (roles.includes("DEAN")) return "/staff/dashboard";
  if (roles.includes("HOD")) return "/staff/dashboard";
  if (roles.includes("COURSE_ADVISER")) return "/staff/dashboard";
  if (roles.includes("LECTURER")) return "/staff/dashboard";
  if (roles.includes("STUDENT")) return "/student/dashboard";
  return "/";
}