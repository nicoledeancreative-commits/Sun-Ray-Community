import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to Sun Ray Community
      </h1>
      <p className="max-w-md text-muted-foreground">
        A fresh Next.js + Supabase starter with authentication already wired
        up.
      </p>
      <div className="flex gap-3">
        {user ? (
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
