"use client";

import { useActionState } from "react";
import { updateDashboardAbout, type ContentActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ContentActionState = {};

export function DashboardAboutForm({ about }: { about: string }) {
  const [state, formAction, pending] = useActionState(
    updateDashboardAbout,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dashboard — &quot;About&quot; card</CardTitle>
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

          <RichTextEditor name="dashboard_about" defaultValue={about} />

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
