"use client";

import { useActionState } from "react";
import { updateQuickNote, type ContentActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ContentActionState = {};

export function QuickNoteForm({ note }: { note: string }) {
  const [state, formAction, pending] = useActionState(
    updateQuickNote,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Homepage — &quot;A Quick Note&quot;</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
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

          <RichTextEditor name="homepage_quick_note" defaultValue={note} />

          <div>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
