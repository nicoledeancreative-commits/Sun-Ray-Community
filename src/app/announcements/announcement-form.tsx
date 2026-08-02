"use client";

import { useActionState, useRef, useEffect } from "react";
import { createAnnouncement, type AnnouncementActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: AnnouncementActionState = {};

export function AnnouncementForm() {
  const [state, formAction, pending] = useActionState(
    createAnnouncement,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Post an Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state.success && (
            <Alert>
              <AlertDescription>{state.success}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="What's the news?" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              name="body"
              rows={4}
              placeholder="Share the details..."
              required
            />
          </div>

          <div>
            <Button type="submit" disabled={pending}>
              {pending ? "Posting..." : "Post Announcement"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
