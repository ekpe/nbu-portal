export function computeAcademicStanding(gpa: number, carryoverCount: number) {
  if (gpa >= 4.5) return "DISTINCTION";
  if (gpa >= 3.5) return carryoverCount > 0 ? "GOOD STANDING WITH CARRYOVER" : "GOOD STANDING";
  if (gpa >= 2.0) return carryoverCount > 0 ? "PROBATION RISK" : "SATISFACTORY";
  return "PROBATION";
}