"use client";

import { useActionState } from "react";
import { updateWhatWeDo, type ContentActionState } from "./actions";
import type { WhatWeDoItem } from "@/lib/supabase/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ContentActionState = {};

export function WhatWeDoForm({ items }: { items: WhatWeDoItem[] }) {
  const [state, formAction, pending] = useActionState(
    updateWhatWeDo,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Homepage — &quot;What We Do&quot;</CardTitle>
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

          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2 border-t pt-4 first:border-t-0 first:pt-0">
              <Label htmlFor={`title_${i}`}>Item {i + 1} title</Label>
              <Input
                id={`title_${i}`}
                name={`title_${i}`}
                defaultValue={items[i]?.title}
                required
              />
              <Label htmlFor={`description_${i}`}>Item {i + 1} description</Label>
              <Textarea
                id={`description_${i}`}
                name={`description_${i}`}
                defaultValue={items[i]?.description}
                rows={2}
                required
              />
            </div>
          ))}

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
