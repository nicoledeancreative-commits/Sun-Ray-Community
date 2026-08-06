"use client";

import { useState, useTransition } from "react";
import { deletePost } from "./actions";
import type { Post } from "@/lib/supabase/posts";
import { PostEditForm } from "./post-edit-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RICH_TEXT_CLASSES } from "@/lib/rich-text-classes";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function PostItem({
  post,
  canManage,
}: {
  post: Post;
  canManage: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <PostEditForm
            id={post.id}
            body={post.body}
            onDone={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  const isHtml = post.body.includes("<");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
            {(post.author_name?.trim()?.charAt(0) || "?").toUpperCase()}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {post.author_name ?? "A neighbor"}
              </span>
              {post.author_role && post.author_role !== "member" && (
                <Badge variant="secondary" className="capitalize">
                  {post.author_role}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isHtml ? (
          <div
            className={RICH_TEXT_CLASSES}
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm">{post.body}</p>
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
                if (confirm("Delete this post?")) {
                  startTransition(() => {
                    deletePost(post.id);
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
