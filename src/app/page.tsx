import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WHAT_WE_DO = [
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
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const primaryHref = user ? "/dashboard" : "/signup";

  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center gap-6 px-4 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to Sun Ray Homes
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Your neighborhood, your community center, your neighbors.
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
        <p className="text-muted-foreground">
          Sun Ray Community Center Volunteers is a group of neighbors who keep
          the Sun Ray Community Center running — cared for, open, and
          available for the people who live here. We&apos;re not a
          homeowners&apos; association, and we don&apos;t oversee homes,
          yards, or private property. Our job is simple: take care of the
          community center and bring neighbors together.
        </p>
      </section>

      <section id="what-we-do" className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">
          What We Do
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {WHAT_WE_DO.map((item) => (
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
          Get Involved
        </h2>
        <p className="mb-6 text-muted-foreground">
          Whether you want to volunteer a few hours, donate supplies, or just
          show up to the next potluck — there&apos;s a place for you here.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={primaryHref}>Become a Volunteer</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={primaryHref}>Make a Donation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={primaryHref}>View Upcoming Events</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Sun Ray Community Center Volunteers is volunteer-run and focused
          solely on the community center. We don&apos;t manage homes, yards,
          or private property, and participation in everything we do is
          completely voluntary.
        </p>
      </section>
    </div>
  );
}
