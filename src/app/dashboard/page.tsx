import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { getAnnouncements } from "@/lib/supabase/announcements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getFirstName(name: string | null | undefined, email: string | undefined) {
  if (name && name.trim()) {
    return name.trim().split(" ")[0];
  }
  if (email) {
    return email.split("@")[0];
  }
  return "there";
}

const WIDGETS: {
  icon: string;
  title: string;
  description: string;
  empty: string;
}[] = [
  {
    icon: "📅",
    title: "Upcoming Events",
    description:
      "The monthly potluck, movie nights, and Summer Lunch Program hours.",
    empty: "No events posted yet — check back soon.",
  },
  {
    icon: "🤝",
    title: "Volunteer Opportunities",
    description: "Ways to pitch in this week.",
    empty: "No open volunteer requests right now.",
  },
  {
    icon: "💛",
    title: "Buy, Sell & Give",
    description: "Free items, items for sale, and requests from neighbors.",
    empty: "No posts yet.",
  },
  {
    icon: "📸",
    title: "Recent Photos",
    description: "Snapshots from potlucks, movie nights, and the lunch program.",
    empty: "No photos yet.",
  },
];

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
  const announcements = await getAnnouncements(supabase, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Welcome back, {firstName}! 👋 Here&apos;s what&apos;s happening
        around Sun Ray.
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {WIDGETS.slice(0, 1).map((widget) => (
          <Card key={widget.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span aria-hidden>{widget.icon}</span>
                {widget.title}
              </CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{widget.empty}</p>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span aria-hidden>📣</span>
              Latest Announcements
            </CardTitle>
            <CardDescription>
              News from the volunteers who run the center.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No announcements yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {announcements.map((announcement) => (
                  <li key={announcement.id} className="text-sm">
                    <span className="font-medium">{announcement.title}</span>
                  </li>
                ))}
              </ul>
            )}
            <div>
              <Button asChild variant="link" className="h-auto p-0">
                <Link href="/announcements">View all announcements →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {WIDGETS.slice(1).map((widget) => (
          <Card key={widget.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span aria-hidden>{widget.icon}</span>
                {widget.title}
              </CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{widget.empty}</p>
            </CardContent>
          </Card>
        ))}

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
  );
}
