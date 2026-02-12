"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";

const TYPES = [
  { value: "general", label: "General" },
  { value: "promotion", label: "Promotion" },
  { value: "offer", label: "Offer" },
  { value: "reminder", label: "Reminder" },
];

export function EditNotificationForm({
  id,
  initialUserId,
  initialTitle,
  initialBody,
  initialType,
}: {
  id: string;
  initialUserId: string;
  initialTitle: string;
  initialBody: string;
  initialType: string;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState(initialUserId);
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [notificationType, setNotificationType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const res = await fetch(`/api/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId.trim() || null,
        title: title.trim(),
        body: body.trim(),
        notification_type: notificationType,
      }),
    });
    setLoading(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMessage({ type: "ok", text: "Notification updated." });
      router.refresh();
    } else {
      setMessage({ type: "err", text: data.error ?? "Failed to update." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>User ID (optional, leave empty for broadcast)</Label>
        <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="uuid" className="mt-1 bg-slate-800/80 border-slate-600" />
      </div>
      <div>
        <Label>Type</Label>
        <SelectNative
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value)}
          className="mt-1"
          options={TYPES}
        />
      </div>
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 bg-slate-800/80 border-slate-600" />
      </div>
      <div>
        <Label>Body</Label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={3} className="mt-1 bg-slate-800/80 border-slate-600" />
      </div>
      {message && (
        <p className={message.type === "ok" ? "text-sm text-emerald-600" : "text-sm text-red-400"}>{message.text}</p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/notifications/list">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
