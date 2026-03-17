export function computeGrade(totalScore: number) {
  if (totalScore >= 70) return { letterGrade: "A", gradePoint: 5, remark: "PASS" };
  if (totalScore >= 60) return { letterGrade: "B", gradePoint: 4, remark: "PASS" };
  if (totalScore >= 50) return { letterGrade: "C", gradePoint: 3, remark: "PASS" };
  if (totalScore >= 45) return { letterGrade: "D", gradePoint: 2, remark: "PASS" };
  if (totalScore >= 40) return { letterGrade: "E", gradePoint: 1, remark: "PASS" };
  return { letterGrade: "F", gradePoint: 0, remark: "FAIL" };
}