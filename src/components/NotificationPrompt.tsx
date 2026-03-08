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
    <div style={{
      textAlign: 'center',
      padding: '0.75rem',
      background: '#f5efe3',
      borderRadius: '10px',
      marginBottom: '1.5rem',
      fontSize: '0.85rem',
      color: '#7a5c3a',
      fontFamily: "'Lora', serif",
      fontStyle: 'italic'
    }}>
      ✦ You'll receive daily prayer reminders at 8am
    </div>
  );

  return (
    <div style={{
      background: '#faf7f0',
      border: '1px solid #d4c4a8',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 12px rgba(44,36,22,0.07)'
    }}>
      <div style={{
        fontFamily: "'Lora', serif",
        fontWeight: 500,
        color: '#2c2416',
        marginBottom: '0.3rem'
      }}>
        Get daily prayer reminders
      </div>
      <div style={{
        fontSize: '0.85rem',
        color: '#9c8b75',
        marginBottom: '1rem'
      }}>
        Receive a notification at 8am each day to pray for Slovenia.
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={subscribe}
          disabled={loading}
          style={{
            background: '#7a5c3a',
            color: '#faf7f0',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.25rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? "Setting up..." : "Yes, remind me"}
        </button>
        <button
          onClick={() => setShow(false)}
          style={{
            background: 'none',
            border: '1px solid #d9cfc0',
            borderRadius: '8px',
            padding: '0.6rem 1.25rem',
            fontSize: '0.85rem',
            color: '#9c8b75',
            cursor: 'pointer'
          }}
        >
          No thanks
        </button>
      </div>
    </div>
  );
}