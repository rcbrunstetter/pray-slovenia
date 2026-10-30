"use client";

import { type FormEvent, useRef, useState } from "react";
import ConfirmButton from "@/components/ConfirmButton";
import { Button, Card, Eyebrow, Field, inputClass, Notice, SectionTitle } from "@/components/ui";
import { adminRequest } from "@/lib/admin-api";
import type { RecurringPrompt } from "@/lib/prompts";

const EMPTY = { day_of_month: "", title: "", content: "", verse: "" };

export default function RecurringManager({ initial }: { initial: RecurringPrompt[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [listError, setListError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function startEdit(item: RecurringPrompt) {
    setForm({
      day_of_month: String(item.day_of_month),
      title: item.title,
      content: item.content,
      verse: item.verse ?? "",
    });
    setEditingId(item.id);
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
    const day = parseInt(form.day_of_month, 10);
    if (items.some(item => item.day_of_month === day && item.id !== editingId)) {
      setStatus({ tone: "error", text: `Day ${day} already has a recurring prompt. Use Edit below to change it.` });
      return;
    }
    setSaving(true);
    setStatus(null);
    const body = { ...form, day_of_month: day, id: editingId ?? undefined };
    const { ok, error, data } = await adminRequest<RecurringPrompt>(
      "/api/admin/recurring",
      editingId ? "PATCH" : "POST",
      body
    );
    setSaving(false);
    if (!ok) {
      setStatus({ tone: "error", text: error ?? "Error saving" });
      return;
    }
    const saved = data ?? { ...form, day_of_month: day, id: editingId! };
    setItems(prev =>
      [saved, ...prev.filter(item => item.id !== saved.id)].sort((a, b) => a.day_of_month - b.day_of_month)
    );
    setForm(EMPTY);
    setEditingId(null);
    setStatus({ tone: "success", text: "Saved!" });
  }

  async function onDelete(id: string) {
    setListError("");
    const { ok, error } = await adminRequest("/api/admin/recurring", "DELETE", { id });
    if (ok) setItems(prev => prev.filter(item => item.id !== id));
    else setListError(error ?? "Error deleting");
  }

  return (
    <>
      <section className="flex flex-col gap-3">
        <SectionTitle>{editingId ? "Edit Recurring Prompt" : "Add Recurring Prompt"}</SectionTitle>
        <form ref={formRef} onSubmit={onSave} className="flex scroll-mt-24 flex-col gap-4">
          <Field label="Day of Month">
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="31"
              required
              placeholder="e.g. 1 for the 1st of every month"
              value={form.day_of_month}
              onChange={e => setForm(f => ({ ...f, day_of_month: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Title">
            <input
              type="text"
              required
              placeholder="Prayer focus title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Scripture (optional)">
            <input
              type="text"
              placeholder="e.g. Psalm 122:6"
              value={form.verse}
              onChange={e => setForm(f => ({ ...f, verse: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Content">
            <textarea
              required
              rows={8}
              placeholder="Prayer prompt content..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </Field>
          {status && <Notice tone={status.tone}>{status.text}</Notice>}
          <div className="flex gap-2.5">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Recurring Prompt"}
            </Button>
            {editingId && <Button variant="ghost" className="h-12" onClick={stopEdit}>Cancel</Button>}
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Active Recurring Prompts</SectionTitle>
        {listError && <Notice>{listError}</Notice>}
        {items.length === 0 && <p className="text-[19px] text-ink-soft italic">No recurring prompts yet.</p>}
        {items.map(item => (
          <Card key={item.id} className="flex flex-col gap-1.5">
            <Eyebrow>Day {item.day_of_month}</Eyebrow>
            <div className="text-[22px] leading-[1.22] font-medium dark:font-normal">{item.title}</div>
            {item.verse && <div className="text-[18px] text-ink-soft italic">{item.verse}</div>}
            <div className="line-clamp-3 text-[19px] leading-[1.48] text-update">{item.content}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => startEdit(item)}>Edit</Button>
              <ConfirmButton onConfirm={() => onDelete(item.id)} />
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}
