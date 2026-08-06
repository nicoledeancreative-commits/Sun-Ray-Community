import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { getSiteContent } from "@/lib/supabase/site-content";
import { HeroForm } from "./hero-form";
import { WhatWeDoForm } from "./what-we-do-form";
import { GetInvolvedForm } from "./get-involved-form";
import { QuickNoteForm } from "./quick-note-form";
import { DashboardAboutForm } from "./dashboard-about-form";

export default async function AdminContentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/content");
  }

  const profile = await getProfile(supabase, user.id);
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const content = await getSiteContent(supabase);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        Edit Site Content
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Changes here update the live Homepage and Dashboard for everyone,
        right away.
      </p>

      <div className="flex flex-col gap-6">
        <HeroForm
          title={content.homepage_hero_title}
          subtitle={content.homepage_hero_subtitle}
          intro={content.homepage_intro}
        />
        <WhatWeDoForm items={content.homepage_what_we_do} />
        <GetInvolvedForm
          title={content.homepage_get_involved_title}
          body={content.homepage_get_involved_body}
        />
        <QuickNoteForm note={content.homepage_quick_note} />
        <DashboardAboutForm about={content.dashboard_about} />
      </div>
    </div>
  );
}
