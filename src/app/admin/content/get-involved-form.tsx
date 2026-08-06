"use client";

import { useActionState } from "react";
import { updateGetInvolved, type ContentActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ContentActionState = {};

export function GetInvolvedForm({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateGetInvolved,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Homepage — &quot;Get Involved&quot;</CardTitle>
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="homepage_get_involved_title">Section title</Label>
            <Input
              id="homepage_get_involved_title"
              name="homepage_get_involved_title"
              defaultValue={title}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Body</Label>
            <RichTextEditor
              name="homepage_get_involved_body"
              defaultValue={body}
            />
          </div>

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
