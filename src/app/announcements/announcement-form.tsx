"use client";

import { useActionState, useRef, useEffect } from "react";
import {
  createAnnouncement,
  updateAnnouncement,
  type AnnouncementActionState,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: AnnouncementActionState = {};

export function AnnouncementForm({
  announcement,
  onDone,
}: {
  announcement?: { id: string; title: string; body: string };
  onDone?: () => void;
}) {
  const action = announcement
    ? updateAnnouncement.bind(null, announcement.id)
    : createAnnouncement;
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {announcement ? "Edit Announcement" : "Post an Announcement"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state.success && !announcement && (
            <Alert>
              <AlertDescription>{state.success}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="What's the news?"
              defaultValue={announcement?.title}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Message</Label>
            <RichTextEditor name="body" defaultValue={announcement?.body} />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving..."
                : announcement
                  ? "Save Changes"
                  : "Post Announcement"}
            </Button>
            {announcement && (
              <Button type="button" variant="ghost" onClick={onDone}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
