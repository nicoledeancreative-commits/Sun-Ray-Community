import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { getAnnouncements } from "@/lib/supabase/announcements";
import { AnnouncementForm } from "./announcement-form";
import { AnnouncementItem } from "./announcement-item";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/announcements");
  }

  const profile = await getProfile(supabase, user.id);
  const canPost = profile?.role === "admin" || profile?.role === "moderator";
  const announcements = await getAnnouncements(supabase);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Announcements
      </h1>

      <div className="flex flex-col gap-6">
        {canPost && <AnnouncementForm />}

        {announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No announcements yet — check back soon.
          </p>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementItem
              key={announcement.id}
              announcement={announcement}
              canManage={canPost}
            />
          ))
        )}
      </div>
    </div>
  );
}
