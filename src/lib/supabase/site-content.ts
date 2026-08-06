import type { SupabaseClient } from "@supabase/supabase-js";

export type WhatWeDoItem = {
  title: string;
  description: string;
};

export type LinkButton = {
  label: string;
  // Empty href means "use the smart default" (signup if signed out,
  // dashboard if signed in) — see homepage rendering.
  href: string;
};

export type SiteContent = {
  homepage_hero_title: string;
  homepage_hero_subtitle: string;
  homepage_intro: string;
  homepage_what_we_do: WhatWeDoItem[];
  homepage_get_involved_title: string;
  homepage_get_involved_body: string;
  homepage_get_involved_buttons: LinkButton[];
  homepage_quick_note: string;
  dashboard_about: string;
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  homepage_hero_title: "Welcome to Sun Ray Homes",
  homepage_hero_subtitle:
    "Your neighborhood, your community center, your neighbors.",
  homepage_intro:
    "<p>Sun Ray Community Center Volunteers is a group of neighbors who keep the Sun Ray Community Center running — cared for, open, and available for the people who live here. We're not a homeowners' association, and we don't oversee homes, yards, or private property. Our job is simple: take care of the community center and bring neighbors together.</p>",
  homepage_what_we_do: [
    {
      title: "Host community events",
      description:
        "Including our monthly potluck, movie nights, and seasonal get-togethers.",
    },
    {
      title: "Run the Summer Lunch Program",
      description:
        "Free lunches for kids and teens 18 and under, all summer long.",
    },
    {
      title: "Keep the community center available",
      description:
        "Residents can rent it for parties, family gatherings, showers, classes, and more.",
    },
    {
      title: "Rely on volunteers and donations",
      description: "Everything we do is made possible by neighbors pitching in.",
    },
  ],
  homepage_get_involved_title: "Get Involved",
  homepage_get_involved_body:
    "<p>Whether you want to volunteer a few hours, donate supplies, or just show up to the next potluck — there's a place for you here.</p>",
  homepage_get_involved_buttons: [
    { label: "Become a Volunteer", href: "" },
    { label: "Make a Donation", href: "" },
    { label: "View Upcoming Events", href: "" },
  ],
  homepage_quick_note:
    "<p>Sun Ray Community Center Volunteers is volunteer-run and focused solely on the community center. We don't manage homes, yards, or private property, and participation in everything we do is completely voluntary.</p>",
  dashboard_about:
    "<p>Sun Ray Community Center Volunteers is a volunteer-run group focused on the care, operation, and availability of the Sun Ray Community Center in Frostproof, FL.</p>",
};

export async function getSiteContent(
  supabase: SupabaseClient
): Promise<SiteContent> {
  const { data } = await supabase.from("site_content").select("key, value");

  const content: Record<string, unknown> = { ...DEFAULT_SITE_CONTENT };

  for (const row of data ?? []) {
    if (row.key in content) {
      content[row.key] = row.value;
    }
  }

  return content as SiteContent;
}
