"use client";

import { type FormEvent, useRef, useState } from "react";
import ConfirmButton from "@/components/ConfirmButton";
import { Button, Card, Field, inputClass, Notice, SectionTitle } from "@/components/ui";
import { adminRequest } from "@/lib/admin-api";
import type { Prompt } from "@/lib/prompts";
import { formatDate } from "@/lib/time";

const EMPTY = { date: "", title: "", content: "", verse: "" };

export default function PromptsManager({ initial }: { initial: Prompt[] }) {
  const [prompts, setPrompts] = useState(initial);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [listError, setListError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function startEdit(prompt: Prompt) {
    setForm({ date: prompt.date, title: prompt.title, content: prompt.content, verse: prompt.verse ?? "" });
    setEditing(true);
    setStatus(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function stopEdit() {
    setForm(EMPTY);
    setEditing(false);
    setStatus(null);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!editing && prompts.some(p => p.date === form.date)) {
      setStatus({ tone: "error", text: "That date already has a prompt. Use Edit below to change it." });
      return;
    }
    setSaving(true);
    setStatus(null);
    const { ok, error } = await adminRequest("/api/admin/prompts", "POST", form);
    setSaving(false);
    if (!ok) {
      setStatus({ tone: "error", text: error ?? "Error saving" });
      return;
    }
    setPrompts(prev =>
      [form, ...prev.filter(p => p.date !== form.date)].sort((a, b) => b.date.localeCompare(a.date))
    );
    setForm(EMPTY);
    setEditing(false);
    setStatus({ tone: "success", text: "Saved!" });
  }

  async function onDelete(date: string) {
    setListError("");
    const { ok, error } = await adminRequest(`/api/admin/prompts?date=${date}`, "DELETE");
    if (ok) setPrompts(prev => prev.filter(p => p.date !== date));
    else setListError(error ?? "Error deleting");
  }

  return (
    <>
      <section className="flex scroll-mt-6 flex-col gap-3">
        <SectionTitle>{editing ? "Edit Prompt" : "Add New Prompt"}</SectionTitle>
        <form ref={formRef} onSubmit={onSave} className="flex scroll-mt-24 flex-col gap-4">
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              readOnly={editing}
              required
              className={`${inputClass} min-h-[50px] appearance-none`}
            />
          </Field>
          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              placeholder="e.g. Pray for the youth"
              className={inputClass}
            />
          </Field>
          <Field label="Scripture (optional)">
            <input
              type="text"
              value={form.verse}
              onChange={e => setForm(f => ({ ...f, verse: e.target.value }))}
              placeholder="e.g. Psalm 133:1"
              className={inputClass}
            />
          </Field>
          <Field label="Prayer Content">
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              required
              rows={8}
              placeholder="Write the prayer focus..."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </Field>
          {status && <Notice tone={status.tone}>{status.text}</Notice>}
          <div className="flex gap-2.5">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Save Prompt"}
            </Button>
            {editing && <Button variant="ghost" className="h-12" onClick={stopEdit}>Cancel</Button>}
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Existing Prompts</SectionTitle>
        {listError && <Notice>{listError}</Notice>}
        {prompts.length === 0 && <p className="text-[19px] text-ink-soft italic">No prompts yet.</p>}
        {prompts.map(prompt => (
          <Card key={prompt.date} className="flex flex-col gap-1.5">
            <div className="font-sans text-[13px] font-medium text-meta">
              {formatDate(prompt.date, { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
            </div>
            <div className="text-[22px] leading-[1.22] font-medium dark:font-normal">{prompt.title}</div>
            {prompt.verse && <div className="text-[18px] text-ink-soft italic">{prompt.verse}</div>}
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => startEdit(prompt)}>Edit</Button>
              <ConfirmButton onConfirm={() => onDelete(prompt.date)} />
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}
