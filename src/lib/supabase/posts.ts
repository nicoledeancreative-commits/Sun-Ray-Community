import type { SupabaseClient } from "@supabase/supabase-js";

export type Post = {
  id: string;
  author_id: string;
  title: string | null;
  body: string;
  created_at: string;
  author_name: string | null;
  author_role: "admin" | "moderator" | "member" | null;
};

export async function getPosts(
  supabase: SupabaseClient,
  limit?: number
): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select("id, author_id, title, body, created_at, author:profiles(name, role)")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const author = row.author as unknown as {
      name: string | null;
      role: "admin" | "moderator" | "member" | null;
    } | null;
    return {
      id: row.id,
      author_id: row.author_id,
      title: row.title,
      body: row.body,
      created_at: row.created_at,
      author_name: author?.name ?? null,
      author_role: author?.role ?? null,
    };
  });
}

export async function getMemberCount(supabase: SupabaseClient): Promise<number> {
  const { data, error } = await supabase.rpc("get_member_count");
  if (error || typeof data !== "number") {
    return 0;
  }
  return data;
}
