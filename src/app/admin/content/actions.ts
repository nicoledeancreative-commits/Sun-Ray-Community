"use server";

import DOMPurify from "isomorphic-dompurify";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";

export type ContentActionState = {
  error?: string;
  success?: string;
};

const ALLOWED_TAGS = ["p", "strong", "em", "ul", "ol", "li", "br"];

function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS });
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, error: "You must be signed in." } as const;
  }

  const profile = await getProfile(supabase, user.id);
  if (profile?.role !== "admin") {
    return { supabase, error: "Only admins can edit site content." } as const;
  }

  return { supabase, error: null } as const;
}

async function setContent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  key: string,
  value: unknown
) {
  return supabase.from("site_content").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
}

function isSafeHref(href: string) {
  if (href === "") return true;
  return /^\/(?!\/)/.test(href) || /^https:\/\//.test(href);
}

function afterSave(): ContentActionState {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/admin/content");
  return { success: "Saved." };
}

export async function updateHomepageHero(
  _prevState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const title = String(formData.get("homepage_hero_title") ?? "").trim();
  const subtitle = String(formData.get("homepage_hero_subtitle") ?? "").trim();
  const intro = sanitizeHtml(String(formData.get("homepage_intro") ?? "")).trim();

  if (!title || !subtitle || !intro || intro === "<p></p>") {
    return { error: "Please fill in all fields." };
  }

  const results = await Promise.all([
    setContent(supabase, "homepage_hero_title", title),
    setContent(supabase, "homepage_hero_subtitle", subtitle),
    setContent(supabase, "homepage_intro", intro),
  ]);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  return afterSave();
}

export async function updateWhatWeDo(
  _prevState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const items = [];
  for (let i = 0; i < 4; i++) {
    const title = String(formData.get(`title_${i}`) ?? "").trim();
    const description = String(formData.get(`description_${i}`) ?? "").trim();
    if (!title || !description) {
      return { error: "Please fill in all four items." };
    }
    items.push({ title, description });
  }

  const { error: dbError } = await setContent(
    supabase,
    "homepage_what_we_do",
    items
  );
  if (dbError) return { error: dbError.message };

  return afterSave();
}

export async function updateGetInvolved(
  _prevState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const title = String(
    formData.get("homepage_get_involved_title") ?? ""
  ).trim();
  const body = sanitizeHtml(
    String(formData.get("homepage_get_involved_body") ?? "")
  ).trim();

  if (!title || !body || body === "<p></p>") {
    return { error: "Please fill in both fields." };
  }

  const results = await Promise.all([
    setContent(supabase, "homepage_get_involved_title", title),
    setContent(supabase, "homepage_get_involved_body", body),
  ]);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  return afterSave();
}

export async function updateGetInvolvedButtons(
  _prevState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const buttons = [];
  for (let i = 0; i < 3; i++) {
    const label = String(formData.get(`label_${i}`) ?? "").trim();
    const href = String(formData.get(`href_${i}`) ?? "").trim();
    if (!label) {
      return { error: "Please give every button a label." };
    }
    if (!isSafeHref(href)) {
      return {
        error: `"${href}" isn't a valid link. Use a page path starting with / (like /dashboard) or a full https:// link.`,
      };
    }
    buttons.push({ label, href });
  }

  const { error: dbError } = await setContent(
    supabase,
    "homepage_get_involved_buttons",
    buttons
  );
  if (dbError) return { error: dbError.message };

  return afterSave();
}

export async function updateQuickNote(
  _prevState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const note = sanitizeHtml(
    String(formData.get("homepage_quick_note") ?? "")
  ).trim();

  if (!note || note === "<p></p>") {
    return { error: "Please write something before saving." };
  }

  const { error: dbError } = await setContent(
    supabase,
    "homepage_quick_note",
    note
  );
  if (dbError) return { error: dbError.message };

  return afterSave();
}

export async function updateDashboardAbout(
  _prevState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const about = sanitizeHtml(
    String(formData.get("dashboard_about") ?? "")
  ).trim();

  if (!about || about === "<p></p>") {
    return { error: "Please write something before saving." };
  }

  const { error: dbError } = await setContent(
    supabase,
    "dashboard_about",
    about
  );
  if (dbError) return { error: dbError.message };

  return afterSave();
}
