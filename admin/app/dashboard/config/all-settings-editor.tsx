"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = {
  id?: string;
  setting_key: string;
  setting_value?: number | string | null;
  support_phone?: string | null;
  description?: string | null;
  updated_at?: string;
};

export function AllSettingsEditor() {
  const router = useRouter();
  const [list, setList] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newSupportPhone, setNewSupportPhone] = useState("");

  useEffect(() => {
    fetch("/api/config/settings")
      .then((r) => r.json())
      .then((data) => {
        setList(Array.isArray(data) ? data : []);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  async function save(key: string, payload: { setting_value?: string; support_phone?: string }) {
    setSaving(true);
    await fetch("/api/config/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setting_key: key, ...payload }),
    });
    setSaving(false);
    setEditing(null);
    router.refresh();
    const res = await fetch("/api/config/settings");
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
  }

  async function addNew() {
    if (!newKey.trim()) return;
    setSaving(true);
    await fetch("/api/config/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        setting_key: newKey.trim(),
        ...(newSupportPhone.trim() ? { support_phone: newSupportPhone.trim() } : { setting_value: newValue.trim() }),
      }),
    });
    setSaving(false);
    setNewKey("");
    setNewValue("");
    setNewSupportPhone("");
    router.refresh();
    const res = await fetch("/api/config/settings");
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading settings…</p>;

  return (
    <div className="space-y-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value / Support phone</TableHead>
              <TableHead className="w-24 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((row) => (
              <TableRow key={row.setting_key}>
                <TableCell className="font-mono text-xs">{row.setting_key}</TableCell>
                <TableCell>
                  {editing === row.setting_key ? (
                    row.setting_key === "support_phone" ? (
                      <Input
                        defaultValue={(row as any).support_phone ?? ""}
                        id={`edit-${row.setting_key}`}
                        className="max-w-xs"
                        placeholder="+880..."
                      />
                    ) : (
                      <Input
                        defaultValue={String(row.setting_value ?? "")}
                        id={`edit-${row.setting_key}`}
                        className="max-w-xs"
                      />
                    )
                  ) : (
                    <span className="text-muted-foreground">
                      {(row as any).support_phone != null ? (row as any).support_phone : String(row.setting_value ?? "—")}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editing === row.setting_key ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          const el = document.getElementById(`edit-${row.setting_key}`) as HTMLInputElement;
                          const val = el?.value ?? "";
                          if (row.setting_key === "support_phone") save(row.setting_key, { support_phone: val });
                          else save(row.setting_key, { setting_value: val });
                        }}
                        disabled={saving}
                        className="mr-2"
                      >
                        Save
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button type="button" variant="link" size="sm" className="px-0" onClick={() => setEditing(row.setting_key)}>
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Card>
        <div className="flex flex-wrap items-end gap-3 p-4">
          <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="New setting_key" className="w-56" />
          <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="setting_value (or leave empty)" className="w-40" />
          <Input value={newSupportPhone} onChange={(e) => setNewSupportPhone(e.target.value)} placeholder="support_phone (optional)" className="w-40" />
          <Button onClick={addNew} disabled={saving || !newKey.trim()}>Add setting</Button>
        </div>
      </Card>
    </div>
  );
}
