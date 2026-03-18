export function computeGrade(totalScore: number) {
  if (totalScore >= 70) {
    return { letterGrade: "A", gradePoint: 5, remark: "PASS", isPassed: true, triggersCarryover: false };
  }
  if (totalScore >= 60) {
    return { letterGrade: "B", gradePoint: 4, remark: "PASS", isPassed: true, triggersCarryover: false };
  }
  if (totalScore >= 50) {
    return { letterGrade: "C", gradePoint: 3, remark: "PASS", isPassed: true, triggersCarryover: false };
  }
  if (totalScore >= 45) {
    return { letterGrade: "D", gradePoint: 2, remark: "PASS", isPassed: true, triggersCarryover: false };
  }
  if (totalScore >= 40) {
    return { letterGrade: "E", gradePoint: 1, remark: "PASS", isPassed: true, triggersCarryover: false };
  }

  return { letterGrade: "F", gradePoint: 0, remark: "FAIL", isPassed: false, triggersCarryover: true };
}