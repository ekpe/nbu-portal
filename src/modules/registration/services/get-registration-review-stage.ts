export function getRegistrationReviewStage(status: string) {
  switch (status) {
    case "SUBMITTED":
      return "ADVISER";
    case "ADVISER_APPROVED":
      return "HOD";
    case "HOD_APPROVED":
      return "DEAN";
    case "DEAN_APPROVED":
      return "DONE";
    default:
      return "NONE";
  }
}