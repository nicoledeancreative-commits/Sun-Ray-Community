"use client";

import { useActionState } from "react";
import type { Profile } from "@/lib/supabase/profile";
import { updateProfile, type ProfileActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogoutButton } from "@/components/logout-button";

const initialState: ProfileActionState = {};

export function ProfileForm({
  email,
  profile,
}: {
  email: string;
  profile: Profile | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  );

  const initial = (profile?.name?.trim() || email || "?")
    .charAt(0)
    .toUpperCase();

  return (
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Info</CardTitle>
          <CardDescription>
            Personal information shared on your profile is visible only to
            fellow verified residents/members, not the public.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-xl font-semibold text-secondary-foreground">
              {initial}
            </div>
            <p className="text-sm text-muted-foreground">
              Profile photo uploads are coming soon.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Name</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={profile?.name ?? ""}
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="householdAddress">
              Household / address{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="householdAddress"
              name="householdAddress"
              defaultValue={profile?.household_address ?? ""}
              placeholder="Not shared publicly"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">
              Phone{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ""}
              placeholder="For event RSVPs and volunteer sign-ups"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Involvement</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>Events I&apos;m attending: none yet.</p>
          <p>Volunteer roles I&apos;ve signed up for: none yet.</p>
          <p>Donation history: none yet.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You haven&apos;t posted to the Buy/Sell board or Announcements
            yet.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              name="notifyEvents"
              defaultChecked={profile?.notify_events ?? true}
            />
            Email me about new events
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              name="notifyAnnouncements"
              defaultChecked={profile?.notify_announcements ?? true}
            />
            Email me about announcements
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              name="notifyVolunteer"
              defaultChecked={profile?.notify_volunteer ?? true}
            />
            Notify me about volunteer opportunities
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              name="notifyMarketplace"
              defaultChecked={profile?.notify_marketplace ?? true}
            />
            Notify me about new Buy &amp; Sell posts
          </label>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Changes"}
        </Button>
        <LogoutButton />
      </div>
    </form>
  );
}
