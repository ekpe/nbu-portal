type EmailNotificationInput = {
  to: string;
  subject: string;
  body: string;
};

export async function sendEmailNotification(input: EmailNotificationInput) {
  console.log("EMAIL_NOTIFICATION", input);
}