"use server";

import DOMPurify from "isomorphic-dompurify";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PostActionState = {
  error?: string;
  success?: string;
};

const ALLOWED_TAGS = ["p", "strong", "em", "ul", "ol", "li", "br"];

function sanitizeBody(html: string) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS });
}

export async function createPost(
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const body = sanitizeBody(String(formData.get("body") ?? "")).trim();

  if (!body || body === "<p></p>") {
    return { error: "Write something before posting." };
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    body,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: "Posted." };
}

export async function updatePost(
  id: string,
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const body = sanitizeBody(String(formData.get("body") ?? "")).trim();

  if (!body || body === "<p></p>") {
    return { error: "Write something before saving." };
  }

  const { error } = await supabase
    .from("posts")
    .update({ body, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: "Updated." };
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: "Deleted." };
}
