import { createClientServer } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin";
import Link from "next/link";

export default async function UpdatesAdminPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return <p>Not authorized.</p>;

  const supabase = await createClientServer();
  const { data: updates } = await supabase
    .from("ministry_updates")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ministry Updates</h1>
        <Link href="/admin/updates/new" className="bg-indigo-600 text-white px-3 py-2 rounded text-sm">New Update</Link>
      </div>
      <ul className="space-y-2">
        {updates?.map(u => (
          <li key={u.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{u.title}</div>
              <div className="text-sm text-slate-500">{new Date(u.published_at).toLocaleString()}</div>
            </div>
            <div className="flex gap-3 text-sm">
              <Link className="underline" href={`/admin/updates/edit/${u.id}`}>Edit</Link>
              <form action={`/admin/updates/delete/${u.id}`} method="POST">
                <button className="text-red-600 underline" formAction={`/admin/updates/delete/${u.id}`}>Delete</button>
              </form>
            </div>
          </li>
        )) ?? <p>No updates yet.</p>}
      </ul>
    </div>
  );
}