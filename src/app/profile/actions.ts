"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      name: String(formData.get("fullName") ?? "").trim(),
      household_address: String(formData.get("householdAddress") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      notify_events: formData.get("notifyEvents") === "on",
      notify_announcements: formData.get("notifyAnnouncements") === "on",
      notify_volunteer: formData.get("notifyVolunteer") === "on",
      notify_marketplace: formData.get("notifyMarketplace") === "on",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: "Profile updated." };
}
