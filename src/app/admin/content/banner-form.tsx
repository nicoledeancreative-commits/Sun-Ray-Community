"use client";

import { useActionState } from "react";
import {
  updateDashboardBanner,
  removeDashboardBanner,
  type ContentActionState,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ContentActionState = {};

export function BannerForm({ bannerUrl }: { bannerUrl: string }) {
  const [uploadState, uploadAction, uploadPending] = useActionState(
    updateDashboardBanner,
    initialState
  );
  const [removeState, removeAction, removePending] = useActionState(
    removeDashboardBanner,
    initialState
  );

  const state = removeState.success || removeState.error ? removeState : uploadState;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dashboard banner image</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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

        {bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bannerUrl}
            alt="Current dashboard banner"
            className="h-32 w-full rounded-xl object-cover sm:h-44"
          />
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary/80 to-primary text-sm text-primary-foreground sm:h-44">
            No banner uploaded — showing the default gradient.
          </div>
        )}

        <form action={uploadAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="banner">Upload a new image</Label>
            <Input id="banner" name="banner" type="file" accept="image/*" required />
          </div>
          <div>
            <Button type="submit" disabled={uploadPending}>
              {uploadPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>

        {bannerUrl && (
          <form action={removeAction}>
            <Button type="submit" variant="outline" disabled={removePending}>
              {removePending ? "Removing..." : "Remove banner"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
