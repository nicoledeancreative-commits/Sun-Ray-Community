import type { SupabaseClient } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  name: string | null;
  household_address: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "admin" | "moderator" | "member";
  notify_events: boolean;
  notify_announcements: boolean;
  notify_volunteer: boolean;
  notify_marketplace: boolean;
};

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, name, household_address, phone, avatar_url, role, notify_events, notify_announcements, notify_volunteer, notify_marketplace"
    )
    .eq("id", userId)
    .single();

  return data;
}
