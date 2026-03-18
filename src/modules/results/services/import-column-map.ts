const HEADER_ALIASES: Record<string, string[]> = {
  matricNumber: ["Matriculation Number", "Matric No", "Matric Number", "MATRIC NUMBER"],
  caScore: ["CA 30%", "CA", "Continuous Assessment", "CA_SCORE"],
  examScore: ["Exam 70%", "Exam", "EXAM_SCORE"],
  totalScore: ["Total Score", "Total", "TOTAL_SCORE"],
  q1: ["Q1"],
  q2: ["Q2"],
  q3: ["Q3"],
  q4: ["Q4"],
  q5: ["Q5"],
  q6: ["Q6"],
  q7: ["Q7"],
};

export function getColumnValue(row: Record<string, unknown>, aliases: string[]): unknown {
  for (const alias of aliases) {
    if (alias in row) {
      return row[alias];
    }
  }
  return "";
}

export { HEADER_ALIASES };