import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import { getOnboardingEmailHtml, getOnboardingEmailText } from "../lib/email/templates/onboardingEmail";
import { sendEmail } from "../lib/email/send-email";

async function verifyRedesignedEmail() {
  console.log("==========================================================");
  console.log("   AHVAANAM REDESIGNED ONBOARDING EMAIL VERIFICATION      ");
  console.log("==========================================================\n");

  const sampleData = {
    clientName: "Aditya & Meera",
    invitationTitle: "Aditya & Meera's Wedding Celebration",
    eventDate: "Sunday, February 14, 2027",
    invitationUrl: "http://localhost:3000/invites/aditya-meera",
    dashboardUrl: "https://ahvaanam.in/auth/callback?token_hash=sample_secure_token_12345&type=magiclink&next=/dashboard",
    isNewUser: true,
  };

  const html = getOnboardingEmailHtml(sampleData);
  const text = getOnboardingEmailText(sampleData);

  // 1. Verify Logo
  if (!html.includes("https://ahvaanam.in/images/logo.png")) {
    throw new Error("Logo verification failed: Expected https://ahvaanam.in/images/logo.png in HTML.");
  }
  console.log("✓ Logo verified: Uses actual Ahvaanam logo from https://ahvaanam.in/images/logo.png");

  // 2. Verify Client-Facing Content Restrictions (STRICT NO RATINGS)
  const forbiddenTerms = ["rating", "ratings", "star", "stars", "review", "reviews"];
  for (const term of forbiddenTerms) {
    const regex = new RegExp(`\\b${term}\\b`, "i");
    if (regex.test(html) || regex.test(text)) {
      throw new Error(`Client restriction violation: Found forbidden term "${term}" in email copy!`);
    }
  }
  console.log("✓ Content restriction verified: Zero mention of ratings, stars, or reviews.");

  // 3. Verify 4 Client Features
  const expectedFeatures = [
    "Invitation Insights",
    "RSVP &amp; Guest Responses",
    "Blessings &amp; Memories",
    "Sharing &amp; Invitation Tools",
  ];
  for (const feature of expectedFeatures) {
    if (!html.includes(feature)) {
      throw new Error(`Feature check failed: Missing "${feature}"`);
    }
  }
  console.log("✓ All 4 client-accessible features present.");

  // 4. Verify Heading & CTA
  if (!html.includes("Your celebration is ready to be shared.")) {
    throw new Error("Heading check failed.");
  }
  if (!html.includes("EXPLORE YOUR DASHBOARD")) {
    throw new Error("CTA check failed: Missing EXPLORE YOUR DASHBOARD");
  }
  console.log("✓ Main heading and exact CTA 'EXPLORE YOUR DASHBOARD' verified.");

  // 5. Verify Production Domain Normalization
  if (html.includes("localhost:3000") || html.includes("127.0.0.1")) {
    throw new Error("URL check failed: Found localhost in email output!");
  }
  if (!html.includes("https://ahvaanam.in/invites/aditya-meera")) {
    throw new Error("Expected production invitation URL https://ahvaanam.in/invites/aditya-meera");
  }
  console.log("✓ Production URL normalization verified (no localhost exposure).");

  // 6. Save rendered HTML artifact for inspection
  const outDir = path.join(process.cwd(), "scratch");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "sample-onboarding-email.html"), html, "utf-8");
  console.log("✓ Saved rendered sample to scratch/sample-onboarding-email.html");

  // 7. Dispatch test email via Resend service
  console.log("\nDispatching sample email via Resend service...");
  const targetEmail = process.argv[2] || "ahvaanam.studio@gmail.com";
  const result = await sendEmail({
    to: targetEmail,
    subject: "Your wedding invitation is published! Access your Ahvaanam dashboard.",
    html,
    text,
  });

  console.log("Send result:", {
    success: result.success,
    simulated: result.simulated,
    id: result.id,
    provider: result.provider,
  });

  console.log("\n==========================================================");
  console.log("        ALL REDESIGN VERIFICATION CHECKS PASSED           ");
  console.log("==========================================================");
}

verifyRedesignedEmail().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
