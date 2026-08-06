"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function InviteButton() {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "Link copied!" : "Invite"}
    </Button>
  );
}
