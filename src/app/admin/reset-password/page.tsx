"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import { Button, Field, inputClass, Notice, Skeleton } from "@/components/ui";
import { createClientBrowser } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createClientBrowser(), []);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkLink() {
      // The Supabase client uses up a ?code= link by itself as it starts, so
      // look for the session it made rather than exchanging the code again.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setReady(true);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get("token_hash");
      if (tokenHash && params.get("type") === "recovery") {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
        if (!error) {
          setReady(true);
          return;
        }
      }
      setInvalidLink(true);
    }

    checkLink();
  }, [supabase]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

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
      setError(error.message);
    } else {
      router.replace("/admin");
      router.refresh();
    }
  }

  return (
    <PageShell title="Set New Password" subtitle="Pray Slovenia team access">
      {invalidLink && (
        <Notice>
          This link is invalid or has expired.{" "}
          <Link href="/admin/login" className="underline underline-offset-4">Request a new one.</Link>
        </Notice>
      )}

      {!ready && !invalidLink && <Skeleton className="h-40 w-full rounded-[14px]" />}

      {ready && (
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
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Set Password"}
          </Button>
        </form>
      )}
    </PageShell>
  );
}
