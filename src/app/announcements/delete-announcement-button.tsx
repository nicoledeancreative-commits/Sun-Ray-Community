"use client";

import { useTransition } from "react";
import { deleteAnnouncement } from "./actions";
import { Button } from "@/components/ui/button";

export function DeleteAnnouncementButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this announcement?")) {
          startTransition(() => {
            deleteAnnouncement(id);
          });
        }
      }}
    >
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
