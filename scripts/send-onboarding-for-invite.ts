import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

import { provisionClientAndSendOnboarding } from "../lib/onboarding/provisionClient";

async function main() {
  const inviteId = process.argv[2] || "va-vi";
  console.log(`Processing onboarding email for invitation: ${inviteId}`);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const adminDb = createClient(supabaseUrl, serviceRoleKey);

  const { data: invite, error } = await adminDb
    .from("invitations")
    .select("id, config, user_id, status")
    .eq("id", inviteId)
    .single();

  if (error || !invite) {
    console.error(`Invitation ${inviteId} not found:`, error?.message);
    process.exit(1);
  }

  const clientEmail = (
    invite.config?.clientEmail ||
    invite.config?.config?.clientEmail ||
    ""
  ).toLowerCase().trim();

  if (!clientEmail) {
    console.error(`No clientEmail assigned to invitation ${inviteId}`);
    process.exit(1);
  }

  console.log(`Found client email: ${clientEmail}`);
  console.log("Dispatching onboarding email...");

  const result = await provisionClientAndSendOnboarding({
    invitationId: inviteId,
    clientEmail,
    adminDb,
    appBaseUrl: "http://localhost:3000",
    forceResend: true,
  });

  console.log("\n--- RESULT ---");
  console.log("Success:   ", result.success);
  console.log("Email Sent:", result.emailSent);
  console.log("Simulated: ", Boolean(result.simulated));
  console.log("User ID:   ", result.userId);
  if (result.error) {
    console.error("Error:     ", result.error);
  } else {
    console.log("✓ Real onboarding email dispatched successfully!");
  }
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
