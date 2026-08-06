import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { getPosts, getMemberCount } from "@/lib/supabase/posts";
import { getSiteContent } from "@/lib/supabase/site-content";
import { RICH_TEXT_CLASSES } from "@/lib/rich-text-classes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardTabs } from "./dashboard-tabs";
import { InviteButton } from "./invite-button";

function getFirstName(name: string | null | undefined, email: string | undefined) {
  if (name && name.trim()) {
    return name.trim().split(" ")[0];
  }
  if (email) {
    return email.split("@")[0];
  }
  return "there";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  const profile = await getProfile(supabase, user.id);
  const firstName = getFirstName(profile?.name, user.email);
  const isAdmin = profile?.role === "admin";
  const isModerator = isAdmin || profile?.role === "moderator";
  const initial = (profile?.name?.trim() || user.email || "?")
    .charAt(0)
    .toUpperCase();

  const [posts, memberCount, content] = await Promise.all([
    getPosts(supabase),
    getMemberCount(supabase),
    getSiteContent(supabase),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="h-32 rounded-xl bg-gradient-to-r from-primary/80 to-primary sm:h-44" />

      <div className="mb-6 flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Sun Ray Community
          </h1>
          <p className="text-sm text-muted-foreground">
            Private group · {memberCount.toLocaleString()} members
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button asChild variant="outline">
              <Link href="/admin/content">Edit Page Content</Link>
            </Button>
          )}
          <InviteButton />
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Welcome back, {firstName}! Here&apos;s what&apos;s happening around
        Sun Ray.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <DashboardTabs
          posts={posts}
          currentUserId={user.id}
          isModerator={isModerator}
          initial={initial}
        />

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div
                className={RICH_TEXT_CLASSES}
                dangerouslySetInnerHTML={{ __html: content.dashboard_about }}
              />
              <div className="flex items-start gap-2">
                <span aria-hidden>🔒</span>
                <span>
                  <span className="font-medium text-foreground">Private</span>
                  <br />
                  Only members can see who&apos;s in the group and what they
                  post.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Members · {memberCount.toLocaleString()}
              </CardTitle>
              <CardDescription>
                A full member directory is coming soon.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span aria-hidden>🛋️</span>
                Reserve the Community Center
              </CardTitle>
              <CardDescription>
                For parties, family gatherings, showers, classes, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Online requests coming soon</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span aria-hidden>❤️</span>
                Support the Center
              </CardTitle>
              <CardDescription>
                Our work is powered by volunteers and donations. Every bit
                helps keep the center open for everyone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Donations coming soon</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
