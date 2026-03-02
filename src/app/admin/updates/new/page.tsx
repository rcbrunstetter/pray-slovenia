"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewUpdatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/admin/updates/new/action", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) router.push("/admin/updates");
    else alert("Failed to create update.");
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">New Update</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea className="w-full border rounded px-3 py-2 h-40" placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} required/>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}