"use client";

import { useActionState, useState } from "react";
import { updateGroupRules, type ContentActionState } from "./actions";
import type { GroupRule } from "@/lib/supabase/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ContentActionState = {};

export function GroupRulesForm({ rules }: { rules: GroupRule[] }) {
  const [state, formAction, pending] = useActionState(
    updateGroupRules,
    initialState
  );
  const [items, setItems] = useState<GroupRule[]>(
    rules.length > 0 ? rules : [{ title: "", body: "" }]
  );

  function updateItem(index: number, patch: Partial<GroupRule>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { title: "", body: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Group rules</CardTitle>
      </CardHeader>
      <CardContent>
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

          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border-t pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor={`rule_title_${i}`}>Rule {i + 1} title</Label>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(i)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Input
                id={`rule_title_${i}`}
                value={item.title}
                onChange={(e) => updateItem(i, { title: e.target.value })}
                required
              />
              <Label htmlFor={`rule_body_${i}`}>Rule {i + 1} description</Label>
              <Textarea
                id={`rule_body_${i}`}
                value={item.body}
                onChange={(e) => updateItem(i, { body: e.target.value })}
                rows={3}
                required
              />
            </div>
          ))}

          <input type="hidden" name="rules_json" value={JSON.stringify(items)} readOnly />

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addItem}>
              Add rule
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
