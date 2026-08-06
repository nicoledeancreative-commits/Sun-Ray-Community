import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/supabase/site-content";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RICH_TEXT_CLASSES } from "@/lib/rich-text-classes";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const primaryHref = user ? "/dashboard" : "/signup";
  const content = await getSiteContent(supabase);

  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center gap-6 px-4 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          {content.homepage_hero_title}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          {content.homepage_hero_subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href={primaryHref}>Join the Community</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#what-we-do">See What&apos;s Happening</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div
          className={`${RICH_TEXT_CLASSES} text-muted-foreground`}
          dangerouslySetInnerHTML={{ __html: content.homepage_intro }}
        />
      </section>

      <section id="what-we-do" className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">
          What We Do
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {content.homepage_what_we_do.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">
          {content.homepage_get_involved_title}
        </h2>
        <div
          className={`${RICH_TEXT_CLASSES} mb-6 text-muted-foreground`}
          dangerouslySetInnerHTML={{ __html: content.homepage_get_involved_body }}
        />
        <div className="flex flex-wrap justify-center gap-3">
          {content.homepage_get_involved_buttons.map((button, i) => {
            const href = button.href || primaryHref;
            const external = href.startsWith("https://");
            return (
              <Button
                key={i}
                asChild
                variant={i === 0 ? "default" : "outline"}
              >
                <Link
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {button.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div
          className={`${RICH_TEXT_CLASSES} text-muted-foreground`}
          dangerouslySetInnerHTML={{ __html: content.homepage_quick_note }}
        />
      </section>
    </div>
  );
}
