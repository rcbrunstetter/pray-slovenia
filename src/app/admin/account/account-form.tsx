"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { Button, Field, inputClass, Notice, SectionTitle } from "@/components/ui";
import { createClientBrowser } from "@/lib/supabase-browser";

export default function AccountForm() {
  const supabase = useMemo(() => createClientBrowser(), []);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      if (error.message.includes("Auth session missing")) {
        router.push("/admin/login");
        return;
      }
      setError(error.message);
    } else {
      setPassword("");
      setConfirm("");
      setSuccess(true);
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <SectionTitle>Change Password</SectionTitle>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="New Password">
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Confirm Password">
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        {error && <Notice>{error}</Notice>}
        {success && <Notice tone="success">Password updated successfully.</Notice>}
        <Button type="submit" disabled={loading} className="self-start">
          {loading ? "Saving..." : "Update Password"}
        </Button>
      </form>
    </section>
  );
}
