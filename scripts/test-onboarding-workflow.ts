import { createClient } from "@supabase/supabase-js";
import { provisionClientAndSendOnboarding } from "../lib/onboarding/provisionClient";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !serviceRoleKey || !anonKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const adminDb = createClient(supabaseUrl, serviceRoleKey);
const anonClient = createClient(supabaseUrl, anonKey);

async function runTestSuite() {
  console.log("==========================================================");
  console.log("   AHVAANAM AUTOMATED ONBOARDING INTEGRATION TEST SUITE   ");
  console.log("==========================================================\n");

  const timestamp = Date.now();
  const testEmailA = `test_client_a_${timestamp}@ahvaanam-test.com`;
  const inviteIdA = `test-invite-a-${timestamp}`;
  const inviteIdB = `test-invite-b-${timestamp}`;

  let createdUserId: string | null = null;

  try {
    // -----------------------------------------------------------------
    // TEST A: NEW CLIENT ONBOARDING
    // -----------------------------------------------------------------
    console.log("--- TEST A: New Client Provisioning & Magic Link ---");
    
    // Seed initial draft invitation A
    const { error: seedErrA } = await adminDb.from("invitations").insert([{
      id: inviteIdA,
      user_id: null,
      status: "draft",
      payment_status: "pending",
      config: {
        couple: { groom: { name: "Aditya" }, bride: { name: "Meera" } },
        date: "2027-02-14",
        clientEmail: testEmailA,
        themeId: "royal-temple"
      }
    }]);

    if (seedErrA) throw new Error(`Failed to seed test invitation A: ${seedErrA.message}`);
    console.log(`✓ Seeded test invitation: ${inviteIdA}`);

    // Execute automated onboarding
    const resultA = await provisionClientAndSendOnboarding({
      invitationId: inviteIdA,
      clientEmail: testEmailA,
      adminDb,
      appBaseUrl: "http://localhost:3000",
      forceResend: false,
    });

    console.log("Provisioning result A:", resultA);
    if (!resultA.success) throw new Error(`Provisioning failed: ${resultA.error}`);
    if (!resultA.isNewUser) throw new Error("Expected client to be recognized as a new user.");

    createdUserId = resultA.userId || null;
    if (!createdUserId) throw new Error("No user ID returned for new client.");
    console.log(`✓ Created Supabase Auth user: ${createdUserId}`);

    // Verify profile in public.profiles table
    const { data: profileA, error: profErrA } = await adminDb
      .from("profiles")
      .select("*")
      .eq("id", createdUserId)
      .single();

    if (profErrA || !profileA) throw new Error(`Client profile not found in public.profiles: ${profErrA?.message}`);
    if (profileA.role !== "client") throw new Error(`Expected role 'client', found '${profileA.role}'`);
    console.log(`✓ Verified client profile in database with role '${profileA.role}'`);

    // Verify invitation ownership association
    const { data: updatedInviteA } = await adminDb
      .from("invitations")
      .select("user_id, status, config")
      .eq("id", inviteIdA)
      .single();

    if (updatedInviteA?.user_id !== createdUserId) {
      throw new Error(`Invitation not associated with user. Expected ${createdUserId}, got ${updatedInviteA?.user_id}`);
    }
    console.log(`✓ Verified invitation ownership linked to ${createdUserId}`);

    // Verify onboarding email tracking in config
    const trackingA = updatedInviteA.config?.onboarding_email;
    if (!trackingA || !trackingA.sent_at || trackingA.recipient !== testEmailA) {
      throw new Error(`Onboarding email tracking not properly recorded: ${JSON.stringify(trackingA)}`);
    }
    console.log(`✓ Verified onboarding email tracking recorded (status: ${trackingA.status}, recipient: ${trackingA.recipient})`);

    // Generate fresh magic link to simulate the exact email link token verification
    const { data: linkDataA } = await adminDb.auth.admin.generateLink({
      type: "magiclink",
      email: testEmailA,
      options: { redirectTo: "http://localhost:3000/dashboard" }
    });

    const tokenHashA = linkDataA?.properties?.hashed_token;
    const typeA = linkDataA?.properties?.verification_type || "magiclink";
    if (!tokenHashA) throw new Error("Failed to extract hashed_token from generated link.");

    // Simulate clicking the magic link via verifyOtp (passwordless session exchange)
    const { data: sessionA, error: sessionErrA } = await anonClient.auth.verifyOtp({
      token_hash: tokenHashA,
      type: typeA as any,
    });

    if (sessionErrA || !sessionA.session) {
      throw new Error(`Magic link verification failed: ${sessionErrA?.message}`);
    }
    if (sessionA.user?.id !== createdUserId) {
      throw new Error(`Session user ID mismatch. Expected ${createdUserId}, got ${sessionA.user?.id}`);
    }
    console.log(`✓ Successfully verified magic link token and established client session for ${sessionA.user.email}`);

    // Verify that client with active session can access their invitation
    const clientScopedDb = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${sessionA.session.access_token}` } }
    });
    const { data: clientInvites, error: clientFetchErr } = await clientScopedDb
      .from("invitations")
      .select("id, user_id")
      .eq("id", inviteIdA);

    if (clientFetchErr || !clientInvites || clientInvites.length === 0) {
      throw new Error(`Client could not read their own invitation: ${clientFetchErr?.message}`);
    }
    console.log(`✓ Client session successfully retrieved their invitation (${clientInvites[0].id})`);

    // -----------------------------------------------------------------
    // TEST B: EXISTING CLIENT ONBOARDING
    // -----------------------------------------------------------------
    console.log("\n--- TEST B: Existing Client Re-use (Multiple Invitations) ---");

    // Seed second draft invitation B with the SAME client email
    const { error: seedErrB } = await adminDb.from("invitations").insert([{
      id: inviteIdB,
      user_id: null,
      status: "draft",
      payment_status: "pending",
      config: {
        couple: { groom: { name: "Aditya" }, bride: { name: "Meera" } },
        eventTitle: "Reception Celebration",
        date: "2027-02-15",
        clientEmail: testEmailA,
        themeId: "gopuram"
      }
    }]);
    if (seedErrB) throw new Error(`Failed to seed test invitation B: ${seedErrB.message}`);

    // Provision client for invitation B
    const resultB = await provisionClientAndSendOnboarding({
      invitationId: inviteIdB,
      clientEmail: testEmailA,
      adminDb,
      appBaseUrl: "http://localhost:3000",
      forceResend: false,
    });

    console.log("Provisioning result B:", resultB);
    if (!resultB.success) throw new Error(`Provisioning B failed: ${resultB.error}`);
    if (resultB.isNewUser) throw new Error("Existing user was erroneously marked as isNewUser.");
    if (resultB.userId !== createdUserId) {
      throw new Error(`Existing user ID not reused. Expected ${createdUserId}, got ${resultB.userId}`);
    }
    console.log(`✓ Successfully reused existing account without creating duplicate user.`);

    // Verify total users with this email in Supabase Auth is strictly 1
    const { data: allUsers } = await adminDb.auth.admin.listUsers();
    const matchingUsers = (allUsers?.users || []).filter(u => u.email?.toLowerCase().trim() === testEmailA);
    if (matchingUsers.length !== 1) {
      throw new Error(`Duplicate user check failed! Found ${matchingUsers.length} users with email ${testEmailA}`);
    }
    console.log(`✓ Verified exactly 1 auth user exists for ${testEmailA}`);

    // Verify both invitations belong to this client
    const { data: userInvites } = await adminDb
      .from("invitations")
      .select("id, user_id")
      .in("id", [inviteIdA, inviteIdB]);

    if (userInvites?.length !== 2 || userInvites.some(i => i.user_id !== createdUserId)) {
      throw new Error(`Ownership verification failed across multiple invitations: ${JSON.stringify(userInvites)}`);
    }
    console.log(`✓ Both invitations (${inviteIdA}, ${inviteIdB}) correctly associated with user ID: ${createdUserId}`);

    // Test duplicate publish protection on invitation A
    const retryResultA = await provisionClientAndSendOnboarding({
      invitationId: inviteIdA,
      clientEmail: testEmailA,
      adminDb,
      appBaseUrl: "http://localhost:3000",
      forceResend: false,
    });
    if (!retryResultA.alreadySent) {
      throw new Error("Duplicate onboarding prevention failed: Expected alreadySent=true on retry.");
    }
    console.log("✓ Duplicate publish retry prevention verified: suppressed redundant email.");

    // -----------------------------------------------------------------
    // TEST C: SECURITY & RLS ENFORCEMENT
    // -----------------------------------------------------------------
    console.log("\n--- TEST C: Security & RLS Validation ---");

    // 1. One-time link enforcement: Attempting to verify same tokenHashA again should fail
    const { error: reuseErr } = await anonClient.auth.verifyOtp({
      token_hash: tokenHashA,
      type: typeA as any,
    });
    if (!reuseErr) {
      throw new Error("Security failure: Reused one-time magic link token was accepted!");
    }
    console.log(`✓ Reused magic link token correctly rejected: "${reuseErr.message}"`);

    // 2. Invalid token rejection
    const { error: invalidErr } = await anonClient.auth.verifyOtp({
      token_hash: "invalid_token_hash_1234567890abcdef",
      type: "magiclink",
    });
    if (!invalidErr) {
      throw new Error("Security failure: Invalid token hash was accepted!");
    }
    console.log(`✓ Invalid magic link token correctly rejected: "${invalidErr.message}"`);

    // 3. RLS cross-client protection
    // Client A should not be able to read an unassociated draft belonging to another user
    const otherDraftId = `other-draft-${timestamp}`;
    await adminDb.from("invitations").insert([{
      id: otherDraftId,
      user_id: "00000000-0000-0000-0000-000000000001",
      status: "draft",
      payment_status: "pending",
      config: { eventTitle: "Private Other Event" }
    }]);

    const { data: leakedDraft } = await clientScopedDb
      .from("invitations")
      .select("id")
      .eq("id", otherDraftId);

    if (leakedDraft && leakedDraft.length > 0) {
      throw new Error("RLS Breach: Client was able to select another user's draft invitation!");
    }
    console.log("✓ RLS enforced: Client cannot access other users' draft invitations.");

    await adminDb.from("invitations").delete().eq("id", otherDraftId);

    // -----------------------------------------------------------------
    // TEST D: REGRESSION & EXISTING FUNCTIONALITY
    // -----------------------------------------------------------------
    console.log("\n--- TEST D: Regression & Stability Validation ---");

    // Verify existing invitations remain intact
    const { data: allInvitations, error: listInvErr } = await adminDb
      .from("invitations")
      .select("id, status")
      .limit(5);

    if (listInvErr || !allInvitations) {
      throw new Error(`Failed to query invitations: ${listInvErr?.message}`);
    }
    console.log(`✓ Existing invitations query functional (${allInvitations.length} items checked).`);

    // Verify existing public published invitations read access
    const { data: publicInvites, error: pubErr } = await anonClient
      .from("invitations")
      .select("id, status, payment_status")
      .eq("status", "published")
      .eq("payment_status", "paid")
      .limit(3);

    if (pubErr) throw new Error(`Public read query failed: ${pubErr.message}`);
    console.log(`✓ Public read access policy confirmed functional (${publicInvites.length} published invitations accessible to guests).`);

    console.log("\n==========================================================");
    console.log("   ALL INTEGRATION TESTS PASSED (A, B, C, D) SUCCESSFULLY ");
    console.log("==========================================================");

  } finally {
    // Clean up test data
    console.log("\nCleaning up test invitations and auth user...");
    await adminDb.from("invitations").delete().in("id", [inviteIdA, inviteIdB]);
    if (createdUserId) {
      await adminDb.auth.admin.deleteUser(createdUserId);
      await adminDb.from("profiles").delete().eq("id", createdUserId);
    }
    console.log("✓ Cleanup finished.");
  }
}

runTestSuite().catch((err) => {
  console.error("\n❌ TEST SUITE FAILED:", err);
  process.exit(1);
});
