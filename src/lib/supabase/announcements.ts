import type { SupabaseClient } from "@supabase/supabase-js";

export type Announcement = {
  id: string;
  author_id: string;
  title: string;
  body: string;
  created_at: string;
  author_name: string | null;
};

export async function getAnnouncements(
  supabase: SupabaseClient,
  limit?: number
): Promise<Announcement[]> {
  let query = supabase
    .from("announcements")
    .select("id, author_id, title, body, created_at, author:profiles(name)")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const author = row.author as unknown as { name: string | null } | null;
    return {
      id: row.id,
      author_id: row.author_id,
      title: row.title,
      body: row.body,
      created_at: row.created_at,
      author_name: author?.name ?? null,
    };
  });
}
