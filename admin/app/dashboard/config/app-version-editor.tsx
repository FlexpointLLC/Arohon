"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type VersionRow = {
  id: string;
  app_key: string;
  platform: string;
  min_required_version: string;
  latest_version: string;
  store_url_android: string;
  store_url_ios: string;
  change_log: string[];
};

export function AppVersionEditor({
  driverVersion,
  customerVersion,
}: {
  driverVersion: VersionRow | null;
  customerVersion: VersionRow | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);

  async function save(row: VersionRow, updates: Partial<VersionRow>) {
    setSaving(row.id);
    try {
      const res = await fetch("/api/config/app-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, ...updates }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to save app version: ${data.error ?? res.statusText}`);
        return;
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
      return;
    } finally {
      setSaving(null);
    }
    router.refresh();
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {driverVersion && (
        <Card>
          <CardHeader>
            <CardTitle>Driver app (Android)</CardTitle>
          </CardHeader>
          <CardContent>
            <VersionForm row={driverVersion} onSave={save} saving={saving === driverVersion.id} />
          </CardContent>
        </Card>
      )}
      {customerVersion && (
        <Card>
          <CardHeader>
            <CardTitle>Customer app</CardTitle>
          </CardHeader>
          <CardContent>
            <VersionForm row={customerVersion} onSave={save} saving={saving === customerVersion.id} />
          </CardContent>
        </Card>
      )}
      {!driverVersion && !customerVersion && (
        <p className="text-sm text-muted-foreground">No app version rows in database.</p>
      )}
    </div>
  );
}

function VersionForm({
  row,
  onSave,
  saving,
}: {
  row: VersionRow;
  onSave: (row: VersionRow, updates: Partial<VersionRow>) => Promise<void>;
  saving: boolean;
}) {
  const [min, setMin] = useState(row.min_required_version);
  const [latest, setLatest] = useState(row.latest_version);
  const [android, setAndroid] = useState(row.store_url_android ?? "");
  const [ios, setIos] = useState(row.store_url_ios ?? "");
  const [changelog, setChangelog] = useState((row.change_log ?? []).join("\n"));

  return (
    <div className="space-y-3">
      <div>
        <Label>Min required version</Label>
        <Input value={min} onChange={(e) => setMin(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Latest version</Label>
        <Input value={latest} onChange={(e) => setLatest(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Store URL (Android)</Label>
        <Input type="url" value={android} onChange={(e) => setAndroid(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Store URL (iOS)</Label>
        <Input type="url" value={ios} onChange={(e) => setIos(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Changelog (one line per entry)</Label>
        <Textarea value={changelog} onChange={(e) => setChangelog(e.target.value)} rows={3} className="mt-1" />
      </div>
      <Button
        onClick={() =>
          onSave(row, {
            min_required_version: min,
            latest_version: latest,
            store_url_android: android,
            store_url_ios: ios,
            change_log: changelog.split("\n").map((s) => s.trim()).filter(Boolean),
          })
        }
        disabled={saving}
      >
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
