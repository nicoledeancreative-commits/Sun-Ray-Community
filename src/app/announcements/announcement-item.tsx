"use client";

import { useState, useTransition } from "react";
import { deleteAnnouncement } from "./actions";
import type { Announcement } from "@/lib/supabase/announcements";
import { AnnouncementForm } from "./announcement-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RICH_TEXT_CLASSES } from "@/lib/rich-text-classes";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function AnnouncementItem({
  announcement,
  canManage,
}: {
  announcement: Announcement;
  canManage: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (isEditing) {
    return (
      <AnnouncementForm
        announcement={announcement}
        onDone={() => setIsEditing(false)}
      />
    );
  }

  const isHtml = announcement.body.includes("<");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{announcement.title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {formatDate(announcement.created_at)}
          {announcement.author_name ? ` · ${announcement.author_name}` : ""}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isHtml ? (
          <div
            className={RICH_TEXT_CLASSES}
            dangerouslySetInnerHTML={{ __html: announcement.body }}
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm">{announcement.body}</p>
        )}
        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => {
                if (confirm("Delete this announcement?")) {
                  startTransition(() => {
                    deleteAnnouncement(announcement.id);
                  });
                }
              }}
            >
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
