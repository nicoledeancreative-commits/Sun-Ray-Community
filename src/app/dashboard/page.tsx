import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { Badge } from "@/components/ui/badge";
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
    icon: "📣",
    title: "Latest Announcements",
    description: "News from the volunteers who run the center.",
    empty: "No announcements yet.",
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Welcome back, {firstName}! 👋 Here&apos;s what&apos;s happening
        around Sun Ray.
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {WIDGETS.map((widget) => (
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
