"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";

export function CreateNotificationForm() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notificationType, setNotificationType] = useState("general");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const res = await fetch("/api/notifications/create", {
      method: "POST",
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
      setMessage({ type: "ok", text: "Notification created." });
      setTitle("");
      setBody("");
    } else {
      setMessage({ type: "err", text: data.error ?? "Failed to create." });
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>User ID (optional, leave empty for broadcast)</Label>
        <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="uuid" className="mt-1" />
      </div>
      <div>
        <Label>Type</Label>
        <SelectNative
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value)}
          className="mt-1"
          options={[
            { value: "general", label: "General" },
            { value: "promotion", label: "Promotion" },
            { value: "offer", label: "Offer" },
            { value: "reminder", label: "Reminder" },
          ]}
        />
      </div>
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label>Body</Label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={3} className="mt-1" />
      </div>
      {message && (
        <p className={message.type === "ok" ? "text-sm text-emerald-600" : "text-sm text-destructive"}>{message.text}</p>
      )}
      <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create notification"}</Button>
    </form>
  );
}
