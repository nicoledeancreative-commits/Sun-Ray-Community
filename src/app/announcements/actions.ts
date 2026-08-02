"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";

export type AnnouncementActionState = {
  error?: string;
  success?: string;
};

export async function createAnnouncement(
  _prevState: AnnouncementActionState,
  formData: FormData
): Promise<AnnouncementActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!title || !body) {
    return { error: "Please fill in both a title and a message." };
  }

  const { error } = await supabase.from("announcements").insert({
    author_id: user.id,
    title,
    body,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return { success: "Announcement posted." };
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return { success: "Announcement deleted." };
}

export async function canPostAnnouncements(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const profile = await getProfile(supabase, user.id);
  return profile?.role === "admin" || profile?.role === "moderator";
}
