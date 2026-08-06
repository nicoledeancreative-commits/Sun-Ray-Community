"use client";

import { useActionState } from "react";
import { updateGetInvolvedButtons, type ContentActionState } from "./actions";
import type { LinkButton } from "@/lib/supabase/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ContentActionState = {};

export function GetInvolvedButtonsForm({ buttons }: { buttons: LinkButton[] }) {
  const [state, formAction, pending] = useActionState(
    updateGetInvolvedButtons,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Homepage — &quot;Get Involved&quot; buttons
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-6">
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

          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border-t pt-4 first:border-t-0 first:pt-0"
            >
              <Label htmlFor={`label_${i}`}>Button {i + 1} text</Label>
              <Input
                id={`label_${i}`}
                name={`label_${i}`}
                defaultValue={buttons[i]?.label}
                required
              />
              <Label htmlFor={`href_${i}`}>
                Button {i + 1} link{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id={`href_${i}`}
                name={`href_${i}`}
                defaultValue={buttons[i]?.href}
                placeholder="Leave blank for the default sign up / dashboard link"
              />
            </div>
          ))}

          <p className="text-xs text-muted-foreground">
            Leave a link blank to keep the default behavior (signed-out
            visitors go to Sign Up, members go to the Dashboard). To point a
            button somewhere specific, use a page path like{" "}
            <code>/dashboard</code> or a full link starting with{" "}
            <code>https://</code>.
          </p>

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
