import { createClient } from "@supabase/supabase-js";
import { SupabaseClient } from "@supabase/supabase-js";

// Supabase Environment Configurations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const isSupabaseConfigured = supabaseUrl !== "" && supabaseKey !== "";
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

if (!isSupabaseConfigured) {
  console.error("Supabase env credentials missing. The database cannot be initialized.");
}

export function getAdminDb(): SupabaseClient {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(url, key);
}

// 1. GET ALL INVITATION PROFILES
export async function getInvitations(supabaseClient?: SupabaseClient | null, userId?: string | null, isAdmin: boolean = false) {
  const client = supabaseClient || supabase;
  if (!client) throw new Error("Database client not initialized");

  let query = client
    .from("invitations")
    .select("id, config, status, payment_status, updated_at, user_id");
  
  if (!isAdmin && userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Supabase Error fetching list:", error);
    throw error;
  }

  return (data || []).map((row: any) => {
    const json = row.config;
    const isWrapped = json && typeof json === "object" && "category" in json && "config" in json;
    const innerConfig = isWrapped ? (json.config || {}) : (json || {});

    const groomName = innerConfig.couple?.groom?.name || 
                      innerConfig.celebrant?.name || 
                      innerConfig.hosts || 
                      innerConfig.baby?.name || 
                      innerConfig.mother?.name || 
                      innerConfig.company || 
                      innerConfig.festivalName || 
                      "Groom";

    const brideName = innerConfig.couple?.bride?.name || 
                      innerConfig.father?.name || 
                      innerConfig.eventTitle || 
                      "Bride";

    return {
      id: row.id,
      groom: groomName,
      bride: brideName,
      date: innerConfig.countdown?.targetDate || innerConfig.date || "",
      theme: json.themeId || innerConfig.themeId || "royal-temple",
      enabled: innerConfig.hero?.enabled ?? true,
      status: row.status || "draft",
      payment_status: row.payment_status || "pending",
      updatedAt: row.updated_at || "",
    };
  });
}

// 2. GET INVITATION BY ID
export async function getInvitationById(id: string, supabaseClient?: SupabaseClient | null) {
  const client = supabaseClient || supabase;
  if (!client) throw new Error("Database client not initialized");

  const { data, error } = await client
    .from("invitations")
    .select("config, user_id, status, payment_status, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error fetching profile:", error);
    throw error;
  }
  
  if (!data) {
    throw new Error("Invitation profile not found in database");
  }

  return {
    config: data.config,
    user_id: data.user_id,
    status: data.status || "draft",
    payment_status: data.payment_status || "pending",
    updated_at: data.updated_at || ""
  };
}

// 3. CREATE INVITATION
export async function createInvitation(id: string, config: any, userId?: string | null, supabaseClient?: SupabaseClient | null) {
  const client = supabaseClient || supabase;
  if (!client) throw new Error("Database client not initialized");

  const { error } = await client
    .from("invitations")
    .insert([{ 
      id, 
      config, 
      user_id: userId || null,
      status: "draft",
      payment_status: "pending"
    }]);
  
  if (error) {
    console.error("Supabase Error inserting profile:", error);
    throw error;
  }
  return { success: true };
}

// 4. SAVE/UPDATE INVITATION
export async function saveInvitation(id: string, config: any, supabaseClient?: SupabaseClient | null) {
  const client = supabaseClient || supabase;
  if (!client) return { success: false, error: "Database client not initialized" };

  try {
    const { error } = await client
      .from("invitations")
      .update({ config, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Supabase Error updating profile:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile in database" };
  }
}

// 5. DELETE INVITATION
export async function deleteInvitation(id: string, supabaseClient?: SupabaseClient | null) {
  const client = supabaseClient || supabase;
  if (!client) throw new Error("Database client not initialized");

  const { error } = await client
    .from("invitations")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Supabase Error deleting profile:", error);
    throw error;
  }
  return { success: true };
}

// 6. MARK INVITATION AS PAID
export async function payInvitation(id: string, supabaseClient?: SupabaseClient | null) {
  const client = supabaseClient || supabase;
  if (!client) throw new Error("Database client not initialized");

  const { error } = await client
    .from("invitations")
    .update({ payment_status: "paid" })
    .eq("id", id);

  if (error) {
    console.error("Supabase Error updating payment status:", error);
    throw error;
  }
  return { success: true };
}

// 7. MARK INVITATION AS PUBLISHED
export async function publishInvitation(id: string, supabaseClient?: SupabaseClient | null) {
  const client = supabaseClient || supabase;
  if (!client) throw new Error("Database client not initialized");

  const { error } = await client
    .from("invitations")
    .update({ status: "published" })
    .eq("id", id);

  if (error) {
    console.error("Supabase Error updating publication status:", error);
    throw error;
  }
  return { success: true };
}
