"use client";

import { useEffect, useState } from "react";

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") return;
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  async function subscribe() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { setShow(false); setLoading(false); return; }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      const deviceId = document.cookie.match(/device_id=([^;]+)/)?.[1];
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), device_id: deviceId }),
      });

      setShow(false);
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 4000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  if (!show && !showConfirm) return null;

  if (showConfirm) return (
    <p role="status" className="text-center text-[19px] leading-[1.48] text-label italic">
      You’ll receive daily prayer reminders at 8am
    </p>
  );

  return (
    <div className="flex flex-col gap-1.5 rounded-[14px] border border-card-line bg-card p-[18px]">
      <div className="text-[22px] leading-[1.22] font-medium dark:font-normal">Get daily prayer reminders</div>
      <div className="text-[19px] leading-[1.48] text-update">
        Receive a notification at 8am each day to pray for Slovenia.
      </div>
      <div className="mt-2.5 flex gap-2.5 font-sans">
        <button
          onClick={subscribe}
          disabled={loading}
          className="h-11 cursor-pointer rounded-full bg-gold px-5 text-[15px] font-semibold text-night disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Setting up..." : "Yes, remind me"}
        </button>
        <button
          onClick={() => setShow(false)}
          className="h-11 cursor-pointer rounded-full border border-card-line px-5 text-[15px] font-medium text-ink-soft"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}