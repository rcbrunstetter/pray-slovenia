"use client";

import { useEffect, useState } from "react";
import { Button, Card, Notice } from "@/components/ui";

const DISMISSED_KEY = "reminder-prompt-dismissed";

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberDismissed() {
  try {
    localStorage.setItem(DISMISSED_KEY, "1");
  } catch {}
}

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") return;
    if (wasDismissed()) return;
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  async function subscribe() {
    setLoading(true);
    setError("");
    try {
      await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { setShow(false); return; }

      // The worker has to be active before the browser will accept a subscription.
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      if (!res.ok) throw new Error(`Subscribe failed: ${res.status}`);

      setShow(false);
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 4000);
    } catch (err) {
      console.error(err);
      setError("We couldn’t set up reminders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!show && !showConfirm) return null;

  if (showConfirm) return (
    <p role="status" className="fade-in text-center text-[19px] leading-[1.48] text-label italic">
      You’ll receive daily prayer reminders at 8am
    </p>
  );

  return (
    <Card className="fade-in flex flex-col gap-1.5">
      <div className="text-[22px] leading-[1.22] font-medium dark:font-normal">Get daily prayer reminders</div>
      <div className="text-[19px] leading-[1.48] text-update">
        Receive a notification at 8am each day to pray for Slovenia.
      </div>
      {error && <Notice>{error}</Notice>}
      <div className="mt-2.5 flex gap-2.5">
        <Button onClick={subscribe} disabled={loading} className="h-11 px-5 text-[15px]">
          {loading ? "Setting up..." : "Yes, remind me"}
        </Button>
        <Button
          variant="ghost"
          className="h-11"
          onClick={() => {
            rememberDismissed();
            setShow(false);
          }}
        >
          No thanks
        </Button>
      </div>
    </Card>
  );
}
