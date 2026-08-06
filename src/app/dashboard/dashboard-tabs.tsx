"use client";

import type { Post } from "@/lib/supabase/posts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostComposer } from "./post-composer";
import { PostItem } from "./post-item";

const COMING_SOON_TABS: {
  value: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  empty: string;
}[] = [
  {
    value: "events",
    label: "Events",
    icon: "📅",
    title: "Upcoming Events",
    description: "The monthly potluck, movie nights, and Summer Lunch Program hours.",
    empty: "No events posted yet — check back soon.",
  },
  {
    value: "volunteer",
    label: "Volunteer",
    icon: "🤝",
    title: "Volunteer Opportunities",
    description: "Ways to pitch in this week.",
    empty: "No open volunteer requests right now.",
  },
  {
    value: "marketplace",
    label: "Marketplace",
    icon: "💛",
    title: "Buy, Sell & Give",
    description: "Free items, items for sale, and requests from neighbors.",
    empty: "No posts yet.",
  },
  {
    value: "photos",
    label: "Photos",
    icon: "📸",
    title: "Recent Photos",
    description: "Snapshots from potlucks, movie nights, and the lunch program.",
    empty: "No photos yet.",
  },
];

export function DashboardTabs({
  posts,
  currentUserId,
  isModerator,
  initial,
}: {
  posts: Post[];
  currentUserId: string;
  isModerator: boolean;
  initial: string;
}) {
  return (
    <Tabs defaultValue="discussion">
      <TabsList>
        <TabsTrigger value="discussion">Discussion</TabsTrigger>
        {COMING_SOON_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="discussion" className="flex flex-col gap-4">
        <PostComposer initial={initial} />

        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No posts yet — be the first to say hello!
          </p>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              canManage={isModerator || post.author_id === currentUserId}
            />
          ))
        )}
      </TabsContent>

      {COMING_SOON_TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span aria-hidden>{tab.icon}</span>
                {tab.title}
              </CardTitle>
              <CardDescription>{tab.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{tab.empty}</p>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
