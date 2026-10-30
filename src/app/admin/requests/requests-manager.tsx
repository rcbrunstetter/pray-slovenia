"use client";

import { type FormEvent, useRef, useState } from "react";
import ConfirmButton from "@/components/ConfirmButton";
import { Button, Card, Field, inputClass, Notice, SectionTitle } from "@/components/ui";
import { adminRequest } from "@/lib/admin-api";
import type { PrayerRequest } from "@/lib/prompts";

const EMPTY = { title: "", content: "", is_urgent: false };

export default function RequestsManager({ initial }: { initial: PrayerRequest[] }) {
  const [requests, setRequests] = useState(initial);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [listError, setListError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function startEdit(request: PrayerRequest) {
    setForm({ title: request.title, content: request.content, is_urgent: request.is_urgent });
    setEditingId(request.id);
    setStatus(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function stopEdit() {
    setForm(EMPTY);
    setEditingId(null);
    setStatus(null);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const { ok, error, data } = editingId
      ? await adminRequest("/api/admin/requests", "PATCH", { id: editingId, ...form })
      : await adminRequest<PrayerRequest>("/api/admin/requests", "POST", form);
    setSaving(false);
    if (!ok) {
      setStatus({ tone: "error", text: error ?? "Error saving" });
      return;
    }
    if (editingId) {
      setRequests(prev => prev.map(r => (r.id === editingId ? { ...r, ...form } : r)));
    } else if (data) {
      setRequests(prev => [data as PrayerRequest, ...prev]);
    }
    setForm(EMPTY);
    setEditingId(null);
    setStatus({ tone: "success", text: editingId ? "Saved!" : "Posted!" });
  }

  async function onToggleActive(id: number, current: boolean) {
    setListError("");
    const { ok, error } = await adminRequest("/api/admin/requests", "PATCH", { id, is_active: !current });
    if (ok) setRequests(prev => prev.map(r => (r.id === id ? { ...r, is_active: !current } : r)));
    else setListError(error ?? "Error updating");
  }

  async function onDelete(id: number) {
    setListError("");
    const { ok, error } = await adminRequest(`/api/admin/requests?id=${id}`, "DELETE");
    if (ok) setRequests(prev => prev.filter(r => r.id !== id));
    else setListError(error ?? "Error deleting");
  }

  return (
    <>
      <section className="flex flex-col gap-3">
        <SectionTitle>{editingId ? "Edit Update" : "Post New Update"}</SectionTitle>
        <form ref={formRef} onSubmit={onSave} className="flex scroll-mt-24 flex-col gap-4">
          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              placeholder="e.g. Pray for the Novak family"
              className={inputClass}
            />
          </Field>
          <Field label="Details">
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              required
              rows={5}
              placeholder="Describe the prayer need..."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 font-sans text-[15px] text-ink-soft">
            <input
              type="checkbox"
              checked={form.is_urgent}
              onChange={e => setForm(f => ({ ...f, is_urgent: e.target.checked }))}
              className="size-5 accent-[#F4C977]"
            />
            Mark as urgent
          </label>
          {status && <Notice tone={status.tone}>{status.text}</Notice>}
          <div className="flex gap-2.5">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save Changes" : "Post Update"}
            </Button>
            {editingId && <Button variant="ghost" className="h-12" onClick={stopEdit}>Cancel</Button>}
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>All Updates</SectionTitle>
        {listError && <Notice>{listError}</Notice>}
        {requests.length === 0 && <p className="text-[19px] text-ink-soft italic">No updates yet.</p>}
        {requests.map(request => (
          <Card key={request.id} className={`flex flex-col gap-1.5 ${request.is_urgent && request.is_active ? "border-urgent" : ""}`}>
            <div className="font-sans text-[13px] font-medium text-meta">
              {request.is_urgent && <span className="font-semibold text-urgent">Urgent · </span>}
              {!request.is_active && <span className="font-semibold">Inactive · </span>}
              {new Date(request.created_at).toLocaleDateString("en-US", { timeZone: "America/New_York", month: "long", day: "numeric", year: "numeric" })}
            </div>
            <div className={request.is_active ? "contents" : "contents [&>*]:opacity-60"}>
              <div className="text-[22px] leading-[1.22] font-medium dark:font-normal">{request.title}</div>
              <div className="line-clamp-4 text-[19px] leading-[1.48] whitespace-pre-line text-update">{request.content}</div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => startEdit(request)}>Edit</Button>
              <Button variant="ghost" onClick={() => onToggleActive(request.id, request.is_active)}>
                {request.is_active ? "Deactivate" : "Activate"}
              </Button>
              <ConfirmButton onConfirm={() => onDelete(request.id)} />
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}
