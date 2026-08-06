"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { createPost, type PostActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

const initialState: PostActionState = {};

export function PostComposer({ initial }: { initial: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createPost, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-6">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 rounded-full border bg-secondary/30 px-4 py-2 text-left text-sm text-muted-foreground hover:bg-secondary/50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              {initial}
            </span>
            Write something to your neighbors...
          </button>
        ) : (
          <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-3"
          >
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <RichTextEditor name="body" />
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Posting..." : "Post"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
