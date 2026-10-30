"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { Button, Field, inputClass, Notice } from "@/components/ui";
import { createClientBrowser } from "@/lib/supabase-browser";

export default function LoginForm({ denied }: { denied: boolean }) {
  const supabase = useMemo(() => createClientBrowser(), []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(denied ? "This account doesn’t have admin access." : "");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.replace("/admin");
      router.refresh();
    }
  }

  async function onForgotPassword() {
    if (!email) {
      setError("Enter your email address above, then tap Forgot password.");
      return;
    }
    setResetLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setResetLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
  }

  if (resetSent) {
    return <Notice tone="success">Password reset email sent. Check your inbox.</Notice>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="Email">
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Password">
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={inputClass}
        />
      </Field>
      {error && <Notice>{error}</Notice>}
      <Button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <button
        type="button"
        onClick={onForgotPassword}
        disabled={resetLoading}
        className="cursor-pointer self-center font-sans text-sm font-medium text-label underline underline-offset-4"
      >
        {resetLoading ? "Sending..." : "Forgot password?"}
      </button>
    </form>
  );
}
