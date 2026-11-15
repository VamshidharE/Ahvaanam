import dotenv from "dotenv";
dotenv.config();

import { sendEmail } from "../lib/email/send-email";
import { DEFAULT_FROM_EMAIL, DEFAULT_REPLY_TO } from "../lib/email/resend";

async function runResendTest() {
  console.log("==========================================================");
  console.log("        AHVAANAM RESEND INTEGRATION VERIFICATION          ");
  console.log("==========================================================\n");

  const targetEmail = process.argv[2] || process.env.TEST_EMAIL_RECIPIENT || "ahvaanam.studio@gmail.com";
  console.log(`Configured Sender:   ${DEFAULT_FROM_EMAIL}`);
  console.log(`Configured Reply-To: ${DEFAULT_REPLY_TO}`);
  console.log(`Test Recipient:      ${targetEmail}`);
  console.log(`API Key Set:         ${Boolean(process.env.RESEND_API_KEY)}\n`);

  const testSubject = `[Ahvaanam Test] Resend Integration Verification - ${new Date().toLocaleTimeString()}`;
  const testHtml = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF9F6; border: 1px solid #EADBCC; border-radius: 8px;">
      <h2 style="color: #C49B27; margin-bottom: 8px;">Ahvaanam Resend Integration Test</h2>
      <p style="color: #241E1C; line-height: 1.6;">
        This test confirms that transactional emails are successfully routed through Resend via your verified domain <strong>mail.ahvaanam.in</strong>.
      </p>
      <div style="background: #FFFFFF; border-left: 3px solid #C49B27; padding: 12px 16px; margin: 16px 0;">
        <p style="margin: 4px 0; font-size: 13px;"><strong>Sender:</strong> ${DEFAULT_FROM_EMAIL}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Reply-To:</strong> ${DEFAULT_REPLY_TO}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Recipient:</strong> ${targetEmail}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Dispatched At:</strong> ${new Date().toISOString()}</p>
      </div>
      <p style="color: #8C7B70; font-size: 12px;">© Ahvaanam. Bespoke Digital Celebrations.</p>
    </div>
  `;

  console.log("Dispatching test email...");
  const result = await sendEmail({
    to: targetEmail,
    subject: testSubject,
    html: testHtml,
    text: `Ahvaanam Resend Integration Test\nDispatched At: ${new Date().toISOString()}\nSender: ${DEFAULT_FROM_EMAIL}`,
    tags: [{ name: "category", value: "integration_test" }],
  });

  console.log("\n--- RESULT ---");
  console.log("Success:   ", result.success);
  console.log("Simulated: ", Boolean(result.simulated));
  console.log("Email ID:  ", result.id || "N/A");
  if (result.error) {
    console.error("Error:     ", result.error);
  } else {
    console.log("✓ Resend API accepted the email successfully.");
  }
}

runResendTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
