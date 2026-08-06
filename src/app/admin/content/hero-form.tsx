"use client";

import { useActionState } from "react";
import { updateHomepageHero, type ContentActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ContentActionState = {};

export function HeroForm({
  title,
  subtitle,
  intro,
}: {
  title: string;
  subtitle: string;
  intro: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateHomepageHero,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Homepage — Hero &amp; Intro</CardTitle>
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
            <Label htmlFor="homepage_hero_title">Headline</Label>
            <Input
              id="homepage_hero_title"
              name="homepage_hero_title"
              defaultValue={title}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="homepage_hero_subtitle">Subheadline</Label>
            <Input
              id="homepage_hero_subtitle"
              name="homepage_hero_subtitle"
              defaultValue={subtitle}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Intro paragraph</Label>
            <RichTextEditor name="homepage_intro" defaultValue={intro} />
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
