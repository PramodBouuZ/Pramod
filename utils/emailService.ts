// A mock email service for demonstration purposes.
// In a real application, this would use a backend service like SendGrid, Mailgun, etc.

/**
 * Simulates sending an email notification.
 * @param to The recipient's email address.
 * @param subject The subject of the email.
 * @param body The HTML body of the email.
 */
export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  console.log('%c📧 Email Sent!', 'color: #007bff; font-weight: bold;');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('------------------');
  console.log(body);
  console.log('------------------');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
};
